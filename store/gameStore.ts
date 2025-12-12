import { create } from 'zustand';
import Papa from 'papaparse';
import { GameState, Question, MoneyLevel, Option } from '../types';

interface GameStore extends GameState {
  masterQuestions: Question[]; // All questions loaded from CSV
  questions: Question[]; // Current game pool
  moneyLevels: MoneyLevel[];
  
  loadQuestions: () => Promise<void>;
  startGame: () => void;
  selectAnswer: (optionId: string) => void;
  lockAnswer: () => void;
  revealAnswer: () => void;
  goToFeedback: () => void; // Transition to feedback
  handleFeedbackContinue: () => void; // Decision point after feedback
  advanceQuestion: () => void;
  walkAway: () => void;
  togglePause: () => void;
  useFiftyFifty: () => void;
  usePhoneAFriend: () => void;
  useAskAudience: () => void;
  setGameOver: (won: boolean) => void;
  resetGame: () => void;
}

const MONEY_LADDER: MoneyLevel[] = [
  { level: 1, amount: 100, isSafeHaven: false },
  { level: 2, amount: 200, isSafeHaven: false },
  { level: 3, amount: 300, isSafeHaven: false },
  { level: 4, amount: 500, isSafeHaven: false },
  { level: 5, amount: 1000, isSafeHaven: true },
  { level: 6, amount: 2000, isSafeHaven: false },
  { level: 7, amount: 4000, isSafeHaven: false },
  { level: 8, amount: 8000, isSafeHaven: false },
  { level: 9, amount: 16000, isSafeHaven: false },
  { level: 10, amount: 32000, isSafeHaven: true },
  { level: 11, amount: 64000, isSafeHaven: false },
  { level: 12, amount: 125000, isSafeHaven: false },
  { level: 13, amount: 250000, isSafeHaven: false },
  { level: 14, amount: 500000, isSafeHaven: false },
  { level: 15, amount: 1000000, isSafeHaven: true },
];

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

// Logic to generate a fresh game of 15 questions from master list
function generateGameQuestions(masterList: Question[]): Question[] {
  const diff1 = masterList.filter(q => q.difficulty === 1);
  const diff23 = masterList.filter(q => q.difficulty === 2 || q.difficulty === 3);
  const diff45 = masterList.filter(q => q.difficulty === 4 || q.difficulty === 5);

  const tier1 = shuffleArray(diff1).slice(0, 5);
  const tier2 = shuffleArray(diff23).slice(0, 5);
  const tier3 = shuffleArray(diff45).slice(0, 5);

  return [...tier1, ...tier2, ...tier3];
}

const initialState: GameState = {
  currentQuestionIndex: 0,
  score: 0,
  winnings: 0,
  safeHavenAmount: 0,
  lifelines: { fiftyFifty: false, phone: false, audience: false },
  phase: 'intro',
  isPaused: false,
  selectedAnswers: [],
  hiddenAnswers: [],
  audienceStats: null,
  phoneHint: null,
  lastAnswerCorrect: null
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  masterQuestions: [],
  questions: [],
  moneyLevels: MONEY_LADDER,

  loadQuestions: async () => {
    set({ phase: 'loading' });
    try {
      const response = await fetch('/questions.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedQuestions: Question[] = results.data.map((row: any) => {
            // Build options array dynamically
            const options: Option[] = [];
            if (row.option_a) options.push({ id: 'a', label: 'A', text: row.option_a });
            if (row.option_b) options.push({ id: 'b', label: 'B', text: row.option_b });
            if (row.option_c) options.push({ id: 'c', label: 'C', text: row.option_c });
            if (row.option_d) options.push({ id: 'd', label: 'D', text: row.option_d });
            if (row.option_e) options.push({ id: 'e', label: 'E', text: row.option_e });
            if (row.option_f) options.push({ id: 'f', label: 'F', text: row.option_f });

            // Handle correct answer (could be "a" or "a,b")
            const correctRaw = row.correct_answer || '';
            const correctAnswerId = correctRaw.includes(',') 
                ? correctRaw.split(',').map((s: string) => s.trim()) 
                : correctRaw.trim();

            return {
              id: row.id,
              difficulty: parseInt(row.difficulty, 10) as 1|2|3|4|5,
              domain: row.domain,
              text: row.text,
              options,
              correctAnswerId,
              explanation: row.explanation
            };
          });

          set({ masterQuestions: parsedQuestions, phase: 'intro' });
        }
      });
    } catch (error) {
      console.error("Failed to load questions", error);
    }
  },

  startGame: () => {
    const { masterQuestions } = get();
    if (masterQuestions.length === 0) return;
    set({ 
      ...initialState, 
      questions: generateGameQuestions(masterQuestions),
      phase: 'playing' 
    });
  },

  togglePause: () => set(state => ({ isPaused: !state.isPaused })),

  selectAnswer: (optionId) => {
    const { phase, selectedAnswers, currentQuestionIndex, questions, isPaused } = get();
    if (phase !== 'playing' || isPaused) return;

    const currentQ = questions[currentQuestionIndex];
    const isMulti = Array.isArray(currentQ.correctAnswerId);

    let newSelection;
    if (isMulti) {
      if (selectedAnswers.includes(optionId)) {
        newSelection = selectedAnswers.filter(id => id !== optionId);
      } else {
        newSelection = [...selectedAnswers, optionId];
      }
    } else {
      newSelection = [optionId];
    }
    
    set({ selectedAnswers: newSelection });
  },

  lockAnswer: () => {
     const { isPaused } = get();
     if(!isPaused) set({ phase: 'locked' });
  },

  revealAnswer: () => {
    const { questions, currentQuestionIndex, selectedAnswers } = get();
    const currentQ = questions[currentQuestionIndex];
    
    let isCorrect = false;
    if (Array.isArray(currentQ.correctAnswerId)) {
      isCorrect = currentQ.correctAnswerId.length === selectedAnswers.length &&
                  currentQ.correctAnswerId.every(id => selectedAnswers.includes(id));
    } else {
      isCorrect = selectedAnswers[0] === currentQ.correctAnswerId;
    }

    set({ 
      phase: 'revealed', 
      lastAnswerCorrect: isCorrect 
    });
  },

  goToFeedback: () => set({ phase: 'feedback' }),

  handleFeedbackContinue: () => {
      const { lastAnswerCorrect, safeHavenAmount, questions, currentQuestionIndex, winnings } = get();
      
      if (lastAnswerCorrect) {
          // Correct! Move to next or win
          // Calculate winnings for the *just completed* question
          // We need to look ahead.
          // Actually, 'advanceQuestion' handles the index increment.
          // But if we just finished the last question?
          if (currentQuestionIndex >= 14) {
             set({ phase: 'won', winnings: 1000000, safeHavenAmount: 1000000 });
          } else {
             // We need to update winnings BEFORE advancing? 
             // Currently advanceQuestion updates winnings based on the level we just finished.
             get().advanceQuestion();
          }
      } else {
          // Wrong! Game over.
          set({ phase: 'lost', winnings: safeHavenAmount });
      }
  },

  advanceQuestion: () => {
    const { currentQuestionIndex, moneyLevels } = get();
    const currentLevel = moneyLevels[currentQuestionIndex];
    
    // Update safe haven if we just passed one
    let newSafeHaven = get().safeHavenAmount;
    if (currentLevel.isSafeHaven) {
      newSafeHaven = currentLevel.amount;
    }

    set({
      currentQuestionIndex: currentQuestionIndex + 1,
      phase: 'playing',
      selectedAnswers: [],
      hiddenAnswers: [],
      audienceStats: null,
      phoneHint: null,
      winnings: currentLevel.amount,
      safeHavenAmount: newSafeHaven
    });
  },

  walkAway: () => {
    const { winnings } = get();
    set({ phase: 'lost', safeHavenAmount: winnings });
  },

  useFiftyFifty: () => {
    const { lifelines, questions, currentQuestionIndex, hiddenAnswers, isPaused } = get();
    if (lifelines.fiftyFifty || hiddenAnswers.length > 0 || isPaused) return;

    const currentQ = questions[currentQuestionIndex];
    const correctIds = Array.isArray(currentQ.correctAnswerId) ? currentQ.correctAnswerId : [currentQ.correctAnswerId];
    
    const wrongOptions = currentQ.options
      .filter(o => !correctIds.includes(o.id))
      .map(o => o.id);

    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
    const toHide = shuffledWrong.slice(0, 2);

    set({
      lifelines: { ...lifelines, fiftyFifty: true },
      hiddenAnswers: toHide
    });
  },

  usePhoneAFriend: () => {
    const { lifelines, questions, currentQuestionIndex, isPaused } = get();
    if (lifelines.phone || isPaused) return;

    const currentQ = questions[currentQuestionIndex];
    const correctLabel = Array.isArray(currentQ.correctAnswerId) 
      ? "the multiple correct options" 
      : currentQ.options.find(o => o.id === currentQ.correctAnswerId)?.label;

    const confidence = Math.max(40, 95 - (currentQ.difficulty * 10));
    
    set({
      lifelines: { ...lifelines, phone: true },
      phoneHint: `I'm ${confidence}% sure the answer is ${correctLabel}.`
    });
  },

  useAskAudience: () => {
    const { lifelines, questions, currentQuestionIndex, isPaused } = get();
    if (lifelines.audience || isPaused) return;

    const currentQ = questions[currentQuestionIndex];
    const correctIds = Array.isArray(currentQ.correctAnswerId) ? currentQ.correctAnswerId : [currentQ.correctAnswerId];
    
    const stats: Record<string, number> = {};
    let remainingPercent = 100;
    
    const correctBoost = Math.max(20, 80 - (currentQ.difficulty * 15));
    
    currentQ.options.forEach(opt => {
      stats[opt.id] = 0;
    });

    const mainCorrect = correctIds[0];
    stats[mainCorrect] = correctBoost;
    remainingPercent -= correctBoost;

    const otherOptions = currentQ.options.filter(o => o.id !== mainCorrect);
    otherOptions.forEach((opt, idx) => {
        if (idx === otherOptions.length - 1) {
            stats[opt.id] = remainingPercent;
        } else {
            const val = Math.floor(Math.random() * remainingPercent);
            stats[opt.id] = val;
            remainingPercent -= val;
        }
    });

    set({
      lifelines: { ...lifelines, audience: true },
      audienceStats: stats
    });
  },

  setGameOver: (won) => set({ phase: won ? 'won' : 'lost' }),
  resetGame: () => {
      const { masterQuestions } = get();
      set({ ...initialState, masterQuestions, phase: 'intro', questions: generateGameQuestions(masterQuestions) });
  } 
}));
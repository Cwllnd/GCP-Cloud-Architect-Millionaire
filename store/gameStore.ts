import { create } from 'zustand';
import { questions } from '../data/questions';
import { GameState, Question, MoneyLevel } from '../types';

interface GameStore extends GameState {
  questions: Question[];
  moneyLevels: MoneyLevel[];
  
  startGame: () => void;
  selectAnswer: (optionId: string) => void;
  lockAnswer: () => void;
  revealAnswer: () => void;
  advanceQuestion: () => void;
  walkAway: () => void;
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

const initialState: GameState = {
  currentQuestionIndex: 0,
  score: 0,
  winnings: 0,
  safeHavenAmount: 0,
  lifelines: { fiftyFifty: false, phone: false, audience: false },
  phase: 'intro',
  selectedAnswers: [],
  hiddenAnswers: [],
  audienceStats: null,
  phoneHint: null
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  questions: questions,
  moneyLevels: MONEY_LADDER,

  startGame: () => set({ ...initialState, phase: 'playing' }),

  selectAnswer: (optionId) => {
    const { phase, selectedAnswers, currentQuestionIndex, questions } = get();
    if (phase !== 'playing') return;

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
     set({ phase: 'locked' });
  },

  revealAnswer: () => {
    const { questions, currentQuestionIndex, selectedAnswers, safeHavenAmount } = get();
    const currentQ = questions[currentQuestionIndex];
    
    let isCorrect = false;
    if (Array.isArray(currentQ.correctAnswerId)) {
      isCorrect = currentQ.correctAnswerId.length === selectedAnswers.length &&
                  currentQ.correctAnswerId.every(id => selectedAnswers.includes(id));
    } else {
      isCorrect = selectedAnswers[0] === currentQ.correctAnswerId;
    }

    if (isCorrect) {
      set({ phase: 'revealed' });
    } else {
      set({ phase: 'lost', winnings: safeHavenAmount });
    }
  },

  advanceQuestion: () => {
    const { currentQuestionIndex, moneyLevels } = get();
    const currentLevel = moneyLevels[currentQuestionIndex];
    
    // Update winnings and safe haven
    let newSafeHaven = get().safeHavenAmount;
    if (currentLevel.isSafeHaven) {
      newSafeHaven = currentLevel.amount;
    }

    if (currentQuestionIndex >= 14) {
      set({ 
        phase: 'won', 
        winnings: 1000000, 
        safeHavenAmount: 1000000 
      });
      return;
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
    set({ phase: 'lost', safeHavenAmount: winnings }); // 'lost' triggers Game Over screen, but we show current winnings
  },

  useFiftyFifty: () => {
    const { lifelines, questions, currentQuestionIndex, hiddenAnswers } = get();
    if (lifelines.fiftyFifty || hiddenAnswers.length > 0) return;

    const currentQ = questions[currentQuestionIndex];
    // Simple logic for single choice mostly, but handles simple array too
    const correctIds = Array.isArray(currentQ.correctAnswerId) ? currentQ.correctAnswerId : [currentQ.correctAnswerId];
    
    const wrongOptions = currentQ.options
      .filter(o => !correctIds.includes(o.id))
      .map(o => o.id);

    // Shuffle and pick 2 to hide (if possible)
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
    const toHide = shuffledWrong.slice(0, 2);

    set({
      lifelines: { ...lifelines, fiftyFifty: true },
      hiddenAnswers: toHide
    });
  },

  usePhoneAFriend: () => {
    const { lifelines, questions, currentQuestionIndex } = get();
    if (lifelines.phone) return;

    const currentQ = questions[currentQuestionIndex];
    const correctLabel = Array.isArray(currentQ.correctAnswerId) 
      ? "the multiple correct options" 
      : currentQ.options.find(o => o.id === currentQ.correctAnswerId)?.label;

    const confidence = Math.max(40, 95 - (currentQ.difficulty * 10)); // Harder qs = less confidence
    
    set({
      lifelines: { ...lifelines, phone: true },
      phoneHint: `I'm ${confidence}% sure the answer is ${correctLabel}.`
    });
  },

  useAskAudience: () => {
    const { lifelines, questions, currentQuestionIndex } = get();
    if (lifelines.audience) return;

    const currentQ = questions[currentQuestionIndex];
    const correctIds = Array.isArray(currentQ.correctAnswerId) ? currentQ.correctAnswerId : [currentQ.correctAnswerId];
    
    const stats: Record<string, number> = {};
    let remainingPercent = 100;
    
    // Logic: Give correct answer a boost based on ease, distribute rest randomly
    const correctBoost = Math.max(20, 80 - (currentQ.difficulty * 15));
    
    currentQ.options.forEach(opt => {
      stats[opt.id] = 0;
    });

    // Assign to correct
    const mainCorrect = correctIds[0];
    stats[mainCorrect] = correctBoost;
    remainingPercent -= correctBoost;

    // Distribute rest
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
  resetGame: () => set({ ...initialState, questions: questions }) // Resets everything
}));

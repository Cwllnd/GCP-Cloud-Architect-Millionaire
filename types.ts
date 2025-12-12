export interface Option {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswerId: string | string[]; // Can be single "a" or array ["b", "d"]
  difficulty: 1 | 2 | 3 | 4 | 5;
  domain: string;
  explanation: string;
}

export interface MoneyLevel {
  level: number;
  amount: number;
  isSafeHaven: boolean;
}

export type GamePhase = 'intro' | 'loading' | 'playing' | 'locked' | 'revealed' | 'feedback' | 'won' | 'lost';

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  winnings: number;
  safeHavenAmount: number;
  lifelines: {
    fiftyFifty: boolean;
    phone: boolean;
    audience: boolean;
  };
  phase: GamePhase;
  isPaused: boolean;
  selectedAnswers: string[]; 
  hiddenAnswers: string[];
  audienceStats: Record<string, number> | null;
  phoneHint: string | null;
  lastAnswerCorrect: boolean | null; // For the feedback screen
}
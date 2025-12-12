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

export type GamePhase = 'intro' | 'playing' | 'locked' | 'revealed' | 'won' | 'lost';

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
  isPaused: boolean; // New pause state
  selectedAnswers: string[]; // Array to support multi-select
  hiddenAnswers: string[]; // For 50:50
  audienceStats: Record<string, number> | null;
  phoneHint: string | null;
}

import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const MoneyLadder: React.FC = () => {
  const { moneyLevels, currentQuestionIndex, winnings } = useGameStore();

  // Reverse needed because ladder goes bottom-up visually
  const reversedLevels = [...moneyLevels].reverse();

  return (
    <div className="bg-slate-900 border-l border-slate-700 w-full md:w-64 flex flex-col h-full overflow-y-auto">
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider">Current Winnings</p>
        <p className="text-2xl font-bold text-yellow-400">${winnings.toLocaleString()}</p>
      </div>
      <div className="flex-1 flex flex-col justify-center p-2 space-y-1">
        {reversedLevels.map((level) => {
          const isActive = level.level === currentQuestionIndex + 1;
          const isPassed = level.level < currentQuestionIndex + 1;
          const isSafe = level.isSafeHaven;

          return (
            <div
              key={level.level}
              className={`
                flex justify-between items-center px-4 py-1.5 rounded
                ${isActive ? 'bg-orange-500 text-white shadow-lg scale-105 font-bold transition-transform' : ''}
                ${isPassed ? 'text-green-500 opacity-60' : ''}
                ${!isActive && !isPassed ? (isSafe ? 'text-white font-semibold' : 'text-slate-400') : ''}
              `}
            >
              <span className={`text-xs ${isActive ? 'text-white' : 'text-orange-500'}`}>
                {level.level}
              </span>
              <span className={isSafe ? 'text-yellow-200' : ''}>
                ${level.amount.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

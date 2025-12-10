import React from 'react';
import { motion } from 'framer-motion';
import { Option } from '../../types';

interface AnswerOptionProps {
  option: Option;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isRevealed: boolean;
  isHidden: boolean; // For 50:50
  onSelect: () => void;
  showPercent?: number; // Ask Audience
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  isSelected,
  isCorrect,
  isWrong,
  isRevealed,
  isHidden,
  onSelect,
  showPercent
}) => {
  
  if (isHidden) {
    return <div className="invisible h-16 md:h-20" />;
  }

  // Determine Background Color
  let bgColor = "bg-slate-800 border-slate-600"; // Default
  if (isSelected && !isRevealed) {
    bgColor = "bg-orange-500 border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.6)]";
  } else if (isRevealed) {
    if (isCorrect) {
      bgColor = "bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.7)] animate-pulse";
    } else if (isWrong) {
      bgColor = "bg-red-600 border-red-400";
    } else if (!isSelected && !isCorrect) {
        // Unselected wrong answers dim out
        bgColor = "bg-slate-800 opacity-50";
    }
  }

  return (
    <motion.button
      whileHover={!isRevealed ? { scale: 1.02 } : {}}
      whileTap={!isRevealed ? { scale: 0.98 } : {}}
      onClick={onSelect}
      disabled={isRevealed}
      className={`
        relative w-full text-left p-4 md:p-6 rounded-xl border-2 
        transition-colors duration-300 flex items-center group
        ${bgColor}
      `}
    >
      <span className="text-orange-400 font-bold text-xl md:text-2xl mr-4 w-8">
        {option.label}:
      </span>
      <span className="text-white text-md md:text-lg font-medium leading-tight">
        {option.text}
      </span>

      {/* Audience Bar */}
      {showPercent !== undefined && (
        <div className="absolute bottom-1 right-2 bg-slate-900/50 rounded px-2 py-0.5">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full bg-blue-400" style={{ width: `${showPercent}%` }}></div>
            </div>
            <span className="text-xs text-blue-200">{showPercent}%</span>
          </div>
        </div>
      )}
    </motion.button>
  );
};

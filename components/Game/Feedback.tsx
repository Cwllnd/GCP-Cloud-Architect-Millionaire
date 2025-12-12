import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export const Feedback: React.FC = () => {
  const { 
    lastAnswerCorrect, 
    handleFeedbackContinue, 
    questions, 
    currentQuestionIndex 
  } = useGameStore();

  const currentQ = questions[currentQuestionIndex];
  if (!currentQ) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
      >
        {/* Header Color Strip */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'}`} />

        <div className="text-center mb-6">
          <h2 className={`text-4xl font-bold mb-2 ${lastAnswerCorrect ? 'text-green-400' : 'text-red-500'}`}>
            {lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
          </h2>
          {!lastAnswerCorrect && (
             <div className="text-slate-300">
               <span className="font-semibold">Correct Answer: </span>
               <span className="text-white">
                  {Array.isArray(currentQ.correctAnswerId) 
                    ? "Multiple Options (see highlighted)" 
                    : currentQ.options.find(o => o.id === currentQ.correctAnswerId)?.text}
               </span>
             </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-2">Explanation</h3>
            <p className="text-lg text-slate-200 leading-relaxed">
                {currentQ.explanation}
            </p>
        </div>

        <button 
            onClick={handleFeedbackContinue}
            className={`
                w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-[1.02]
                ${lastAnswerCorrect 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'}
            `}
        >
            {lastAnswerCorrect ? 'Next Question' : 'View Results'}
        </button>

      </motion.div>
    </div>
  );
};
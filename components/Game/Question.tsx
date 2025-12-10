import React from 'react';
import { motion } from 'framer-motion';

export const QuestionDisplay: React.FC<{ text: string; domain: string; difficulty: number }> = ({ text, domain, difficulty }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={text} // Re-animate on change
      className="bg-gradient-to-b from-blue-900 to-slate-900 border-2 border-blue-500 rounded-2xl p-6 md:p-8 shadow-2xl relative mt-4 mb-6"
    >
      {/* Decoration Lines */}
      <div className="absolute top-1/2 -left-4 w-8 h-1 bg-blue-500 hidden md:block"></div>
      <div className="absolute top-1/2 -right-4 w-8 h-1 bg-blue-500 hidden md:block"></div>

      <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-widest text-blue-300">
        <span>{domain}</span>
        <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
                 <div key={i} className={`h-2 w-2 rounded-full ${i < difficulty ? 'bg-orange-500' : 'bg-slate-700'}`} />
             ))}
        </div>
      </div>
      
      <h2 className="text-xl md:text-3xl text-center font-semibold leading-relaxed text-white">
        {text}
      </h2>
    </motion.div>
  );
};

import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion } from 'framer-motion';

const LifelineButton: React.FC<{
  icon: string;
  label: string;
  used: boolean;
  onClick: () => void;
}> = ({ icon, label, used, onClick }) => (
  <button
    onClick={onClick}
    disabled={used}
    className={`
      flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2
      transition-all duration-300 relative overflow-hidden group
      ${used 
        ? 'bg-slate-900 border-slate-700 opacity-50 cursor-not-allowed' 
        : 'bg-blue-900 border-blue-400 hover:bg-blue-800 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'
      }
    `}
  >
    {used && (
       <div className="absolute inset-0 flex items-center justify-center z-10">
         <div className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
         <div className="w-full h-0.5 bg-red-500 -rotate-45 absolute" />
       </div>
    )}
    <span className="text-xl md:text-2xl mb-1">{icon}</span>
    <span className="text-[10px] md:text-xs uppercase font-bold tracking-tighter text-blue-200">
      {label}
    </span>
  </button>
);

export const Lifelines: React.FC = () => {
  const { lifelines, useFiftyFifty, usePhoneAFriend, useAskAudience, phase } = useGameStore();
  const disabled = phase !== 'playing';

  return (
    <div className="flex justify-center gap-4 md:gap-8 py-4">
      <LifelineButton 
        icon="⚖️" 
        label="50:50" 
        used={lifelines.fiftyFifty} 
        onClick={() => !disabled && useFiftyFifty()} 
      />
      <LifelineButton 
        icon="📞" 
        label="Phone" 
        used={lifelines.phone} 
        onClick={() => !disabled && usePhoneAFriend()} 
      />
      <LifelineButton 
        icon="👥" 
        label="Ask" 
        used={lifelines.audience} 
        onClick={() => !disabled && useAskAudience()} 
      />
    </div>
  );
};

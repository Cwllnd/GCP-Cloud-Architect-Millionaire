import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const GameTimer: React.FC<{ duration: number }> = ({ duration }) => {
  const phase = useGameStore((state) => state.phase);
  const walkAway = useGameStore((state) => state.walkAway);
  const [seconds, setSeconds] = useState(duration);

  // Sync timer reset when entering playing phase or duration changes
  useEffect(() => {
    if (phase === 'playing') {
      setSeconds(duration);
    }
  }, [phase, duration]);

  // Countdown logic
  useEffect(() => {
    let interval: number;

    if (phase === 'playing' && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && phase === 'playing') {
       walkAway();
    }

    return () => clearInterval(interval);
  }, [phase, seconds, walkAway]);

  // Visual urgency colors
  const getColor = (secs: number) => {
    if (secs > 20) return 'text-white';
    if (secs > 10) return 'text-yellow-400';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="flex justify-center items-center">
        <div className={`
            text-4xl font-mono font-bold border-4 rounded-full w-20 h-20 flex items-center justify-center bg-slate-900
            ${getColor(seconds)} border-current shadow-lg
        `}>
            {seconds}
        </div>
    </div>
  );
};
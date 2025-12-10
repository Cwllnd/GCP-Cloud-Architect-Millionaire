import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { QuestionDisplay } from './components/Game/Question';
import { AnswerOption } from './components/Game/AnswerOption';
import { MoneyLadder } from './components/Game/MoneyLadder';
import { Lifelines } from './components/Game/Lifelines';
import { GameTimer } from './components/Game/Timer';
import { Confetti } from './components/Game/Confetti';
import useSound from 'use-sound';

// Placeholder sounds (You would typically put real mp3 files in public/sounds)
const SOUNDS = {
  correct: 'https://actions.google.com/sounds/v1/cartoon/clank_car_crash.ogg', // Just for example, replace with real assets
  wrong: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
};

function App() {
  const store = useGameStore();
  const { 
    phase, 
    startGame, 
    resetGame, 
    questions, 
    currentQuestionIndex, 
    selectAnswer, 
    selectedAnswers, 
    lockAnswer, 
    revealAnswer, 
    advanceQuestion,
    hiddenAnswers,
    audienceStats,
    phoneHint,
    walkAway,
    winnings
  } = store;

  const currentQ = questions[currentQuestionIndex];
  
  // Timer duration based on difficulty
  const getDuration = () => {
      if (currentQ.difficulty <= 1) return 15;
      if (currentQ.difficulty <= 3) return 30;
      return 45;
  };

  // Sound placeholders
  // In a real app, use local files. Using null here to prevent errors if files missing.
  // const [playCorrect] = useSound('/sounds/correct.mp3'); 

  // Effect for Phase Transitions (Simulate TV Drama)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'locked') {
      // Wait 2 seconds of tension, then reveal
      timeout = setTimeout(() => {
        revealAnswer();
      }, 2000);
    } else if (phase === 'revealed') {
      // Show result for 3 seconds, then move on
      timeout = setTimeout(() => {
        advanceQuestion();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [phase, revealAnswer, advanceQuestion]);


  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
        <div className="max-w-md text-center space-y-8">
          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full blur opacity-75 animate-pulse"></div>
             <div className="relative bg-slate-900 rounded-full p-8 border-4 border-yellow-500 w-48 h-48 mx-auto flex items-center justify-center shadow-2xl">
                 <span className="text-6xl">☁️</span>
             </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 tracking-tight">
            CLOUD ARCHITECT<br/><span className="text-white text-2xl tracking-widest">MILLIONAIRE</span>
          </h1>
          
          <p className="text-slate-300 text-lg">
            Prove your GCP mastery. 15 Questions. 3 Lifelines. One Certification.
          </p>

          <button 
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105"
          >
            START EXAM
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'won' || phase === 'lost') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        {phase === 'won' && <Confetti />}
        <div className="text-center space-y-6 max-w-lg w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className={`text-4xl font-bold ${phase === 'won' ? 'text-green-400' : 'text-slate-200'}`}>
            {phase === 'won' ? 'CERTIFIED ARCHITECT!' : 'ASSESSMENT COMPLETE'}
          </h2>
          
          <div className="py-8">
            <p className="text-slate-400 uppercase tracking-widest text-sm mb-2">Total Winnings</p>
            <p className="text-6xl font-mono font-bold text-yellow-400">
              ${store.safeHavenAmount.toLocaleString()}
            </p>
          </div>

          {phase === 'lost' && (
              <div className="bg-slate-900 p-4 rounded text-left mb-6">
                 <p className="text-red-400 font-bold mb-1">Correct Answer:</p>
                 <p className="text-white mb-4">
                     {Array.isArray(currentQ.correctAnswerId) ? "Multiple Options" : 
                      currentQ.options.find(o => o.id === currentQ.correctAnswerId)?.text}
                 </p>
                 <p className="text-blue-300 text-sm italic border-t border-slate-700 pt-2">
                     {currentQ.explanation}
                 </p>
              </div>
          )}

          <button 
            onClick={resetGame}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isMultiSelect = Array.isArray(currentQ.correctAnswerId);
  const canLock = selectedAnswers.length > 0 && (isMultiSelect ? true : selectedAnswers.length === 1);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar / Ladder (Hidden on mobile initially, maybe show via toggle, but for now kept simple) */}
      <div className="hidden md:block h-screen sticky top-0 z-10">
        <MoneyLadder />
      </div>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative h-[100dvh] overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
            <span className="font-bold text-yellow-500">${winnings.toLocaleString()}</span>
            <span className="text-slate-400 text-sm">Q{currentQuestionIndex + 1}/15</span>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col justify-center">
            
            <div className="mb-6">
                <GameTimer duration={getDuration()} />
            </div>

            <Lifelines />

            {/* Hints Area */}
            {phoneHint && (
                <div className="bg-blue-900/50 border border-blue-500/30 p-4 rounded-lg mb-4 text-blue-200 text-center animate-pulse">
                    📞 Friend says: "{phoneHint}"
                </div>
            )}

            <QuestionDisplay 
                text={currentQ.text} 
                domain={currentQ.domain}
                difficulty={currentQ.difficulty}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers.includes(opt.id);
                    const isCorrectId = Array.isArray(currentQ.correctAnswerId) 
                        ? currentQ.correctAnswerId.includes(opt.id)
                        : currentQ.correctAnswerId === opt.id;

                    return (
                        <AnswerOption
                            key={opt.id}
                            option={opt}
                            isSelected={isSelected}
                            isCorrect={isCorrectId}
                            isWrong={isSelected && !isCorrectId}
                            isRevealed={phase === 'revealed' || phase === 'lost'}
                            isHidden={hiddenAnswers.includes(opt.id)}
                            onSelect={() => selectAnswer(opt.id)}
                            showPercent={audienceStats ? audienceStats[opt.id] : undefined}
                        />
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center gap-4 mt-auto md:mt-0">
                 <button 
                    onClick={walkAway}
                    disabled={phase !== 'playing'}
                    className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                 >
                    Walk Away (${store.winnings.toLocaleString()})
                 </button>

                 <button
                    onClick={lockAnswer}
                    disabled={!canLock || phase !== 'playing'}
                    className={`
                        px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform
                        ${canLock && phase === 'playing'
                            ? 'bg-orange-500 hover:bg-orange-600 text-white scale-100' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed scale-95 opacity-50'}
                    `}
                 >
                    {isMultiSelect ? 'Confirm Selection' : 'Final Answer'}
                 </button>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
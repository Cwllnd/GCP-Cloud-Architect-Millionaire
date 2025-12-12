import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { QuestionDisplay } from './components/Game/Question';
import { AnswerOption } from './components/Game/AnswerOption';
import { MoneyLadder } from './components/Game/MoneyLadder';
import { Lifelines } from './components/Game/Lifelines';
import { GameTimer } from './components/Game/Timer';
import { Confetti } from './components/Game/Confetti';
import { Feedback } from './components/Game/Feedback';

function App() {
  const store = useGameStore();
  const { 
    phase, 
    isPaused,
    loadQuestions,
    startGame, 
    resetGame, 
    togglePause,
    questions, 
    currentQuestionIndex, 
    selectAnswer, 
    selectedAnswers, 
    lockAnswer, 
    revealAnswer, 
    goToFeedback,
    advanceQuestion,
    hiddenAnswers,
    audienceStats,
    phoneHint,
    walkAway,
    winnings
  } = store;

  // Load CSV on mount
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQ = questions[currentQuestionIndex];
  
  // Timer duration based on difficulty
  const getDuration = () => {
      // User requested 120 seconds flat duration
      return 120;
  };

  // Effect for Phase Transitions (Simulate TV Drama)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'locked') {
      // Wait 2 seconds of tension, then reveal
      timeout = setTimeout(() => {
        revealAnswer();
      }, 2000);
    } else if (phase === 'revealed') {
      // Show result for 3 seconds, then show feedback
      timeout = setTimeout(() => {
        goToFeedback();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [phase, revealAnswer, goToFeedback]);

  if (phase === 'loading') {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-4"></div>
              <span className="text-xl">Loading Question Database...</span>
          </div>
      );
  }

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

  // Safety check if questions aren't loaded yet
  if (!currentQ) return null;

  const isMultiSelect = Array.isArray(currentQ.correctAnswerId);
  const canLock = selectedAnswers.length > 0 && (isMultiSelect ? true : selectedAnswers.length === 1);
  const isRevealedPhase = phase === 'revealed' || phase === 'feedback';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Feedback Overlay */}
      {phase === 'feedback' && <Feedback />}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-8 tracking-widest">PAUSED</h2>
            <button 
                onClick={togglePause}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:scale-105 transition"
            >
                RESUME
            </button>
        </div>
      )}

      {/* Sidebar / Ladder */}
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

        <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col justify-center relative">
            
            {/* Top Bar with Timer and Pause */}
            <div className="flex justify-center items-center mb-6 relative">
                 <GameTimer duration={getDuration()} />
                 
                 <button 
                    onClick={togglePause}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition"
                    title="Pause Game"
                    disabled={phase === 'feedback'}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                 </button>
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
                            isRevealed={isRevealedPhase}
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
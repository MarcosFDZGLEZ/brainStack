import React, { useState, useEffect, useRef } from 'react';
import { Book, GraduationCap, Upload, Play, RotateCcw, Trophy, Home, Volume2, VolumeX, Check, X, Brain } from 'lucide-react';

// --- MOCK DATA & CONSTANTS ---

const ACADEMIC_STAGES = [
  { id: 'eso', label: 'E.S.O.' },
  { id: 'bachillerato', label: 'Bachillerato' },
  { id: 'universidad', label: 'Universidad' },
  { id: 'fp', label: 'Formación Profesional' },
  { id: 'master', label: 'Máster' }
];

const SUBJECTS = [
  { id: 'math', label: 'Matemáticas' },
  { id: 'history', label: 'Historia' },
  { id: 'science', label: 'Ciencias Naturales' },
  { id: 'lit', label: 'Literatura Universal' },
  { id: 'english', label: 'Inglés' },
  { id: 'prog', label: 'Programación' }
];

const MOCK_LEADERBOARD = [
  { name: 'Tú', score: 850, avatar: '👤' },
  { name: 'Ana García', score: 1200, avatar: '👩‍🎓' },
  { name: 'Carlos Ruiz', score: 950, avatar: '👨‍💻' },
  { name: 'Elena M.', score: 720, avatar: '👩‍🔬' },
];

// Generador de preguntas simuladas
const generateQuestions = (subject, count) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: i,
      text: `Pregunta simulada ${i + 1} sobre ${subject || 'Conocimiento General'}...`,
      options: [
        "Respuesta Correcta",
        "Respuesta Incorrecta A",
        "Respuesta Incorrecta B",
        "Respuesta Incorrecta C"
      ].sort(() => Math.random() - 0.5),
      correctAnswer: "Respuesta Correcta"
    });
  }
  return questions;
};

// --- COMPONENTS ---

// Componente Individual para el Libro con Animación de Rebote (Keyframes)
const BookItem = ({ width, color, offset, rotation }) => {
  // Usamos variables CSS para pasar los valores aleatorios a la animación @keyframes
  const style = {
    '--tx': `${offset}px`,
    '--rot': `${rotation}deg`,
    // La animación dura 1.2s y se queda en el estado final (forwards)
    animation: 'fallBounce 1.2s ease-in-out forwards'
  };

  return (
    <div
      className={`h-8 ${width} ${color} border-b-2 border-black/20 rounded-sm shadow-md transform origin-center`}
      style={style}
    >
      {/* Lomo del libro simulado */}
      <div className="w-full h-full flex items-center justify-between px-2 opacity-50">
        <div className="w-full h-[1px] bg-white"></div>
      </div>
    </div>
  );
};

// 1. Landing Page
const LandingPage = ({ onStart }) => (
  <div 
    onClick={onStart}
    className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-950 transition-colors duration-500 text-white relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <Book key={i} className="absolute animate-bounce" style={{ 
          top: `${Math.random() * 100}%`, 
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 3}s`
        }} />
      ))}
    </div>
    
    <div className="z-10 flex flex-col items-center animate-pulse">
      <div className="bg-white p-6 rounded-full mb-6 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
        <Brain size={64} className="text-indigo-600" />
      </div>
      <h1 className="text-5xl font-bold mb-2 tracking-wider">STUDY<span className="text-indigo-400">BOT</span></h1>
      <p className="text-xl text-gray-300">Your AI Study Companion</p>
    </div>
    
    <div className="absolute bottom-20 text-indigo-300 text-lg animate-bounce">
      Click Anywhere To Start
    </div>
  </div>
);

// 2. Main Menu
const MainMenu = ({ onSelectMode }) => (
  <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
    <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">What Is Your Plan For Today?</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <button 
        onClick={() => onSelectMode('pdf')}
        className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-indigo-500 flex flex-col items-center"
      >
        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-600 transition-colors">
          <Upload size={48} className="text-indigo-600 group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Subir Apuntes PDF</h3>
        <p className="text-gray-500 text-center">Sube tu teoría y generaré preguntas personalizadas.</p>
      </button>

      <button 
        onClick={() => onSelectMode('manual')}
        className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-500 flex flex-col items-center"
      >
        <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
          <Book size={48} className="text-blue-600 group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Selección Manual</h3>
        <p className="text-gray-500 text-center">Elige tu curso, asignatura y número de preguntas.</p>
      </button>
    </div>
  </div>
);

// 3. Manual Selection Flow
const SelectionFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ stage: '', subject: '', count: 10 });

  const handleStageSelect = (stageId) => {
    setData({ ...data, stage: stageId });
    setStep(1);
  };

  const handleSubjectSelect = (subjectId) => {
    setData({ ...data, subject: subjectId });
    setStep(2);
  };

  const handleStart = () => {
    onComplete(data);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border border-indigo-100">
        <div className="flex justify-between mb-8">
            <div className={`h-2 flex-1 rounded-full mr-2 ${step >= 0 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full mr-2 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
        </div>

        {step === 0 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">¿En qué etapa académica estás?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACADEMIC_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStageSelect(s.id)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-semibold text-gray-700 text-left flex items-center"
                >
                  <GraduationCap className="mr-3 text-indigo-400" size={20} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Selecciona la Asignatura</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSubjectSelect(s.id)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-gray-700 text-center"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-6 text-gray-400 hover:text-gray-600 text-sm">Atrás</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-8">¿Cuántas preguntas quieres?</h3>
            <div className="mb-8">
              <span className="text-6xl font-black text-indigo-600">{data.count}</span>
              <span className="text-gray-400 ml-2">preguntas</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="20" 
              step="1"
              value={data.count}
              onChange={(e) => setData({...data, count: parseInt(e.target.value)})}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-10"
            />
            
            <button 
              onClick={handleStart}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300/50 flex items-center justify-center"
            >
              Generar Test <Play className="ml-2" size={24} fill="currentColor" />
            </button>
            <button onClick={() => setStep(1)} className="mt-4 text-gray-400 hover:text-gray-600 text-sm">Atrás</button>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Game Interface
const GameInterface = ({ questions, onFinish }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bookStack, setBookStack] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQIndex];

  const handleAnswer = (answer) => {
    if (isAnimating || selectedAnswer) return;
    setSelectedAnswer(answer);
    setIsAnimating(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    const points = isCorrect ? 100 : 0;
    
    // Add Book to Stack logic
    const newBook = {
      id: currentQIndex,
      isCorrect: isCorrect,
      color: isCorrect ? ['bg-green-500', 'bg-emerald-600', 'bg-teal-500'][Math.floor(Math.random()*3)] : 'bg-red-500',
      offset: isCorrect ? 0 : (Math.random() * 40 - 20), 
      rotation: isCorrect ? 0 : (Math.random() * 10 - 5), 
      width: isCorrect ? 'w-32' : 'w-28'
    };

    setScore(prev => prev + points);
    setBookStack(prev => [...prev, newBook]);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnimating(false);
      } else {
        onFinish(score + points);
      }
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* DEFINICIÓN DE LA ANIMACIÓN DE CAÍDA Y REBOTE */}
      <style>
        {`
          @keyframes fallBounce {
            0% { 
              transform: translate(var(--tx), -800px) rotate(var(--rot)); 
              opacity: 0; 
            }
            60% { 
              transform: translate(var(--tx), 0px) rotate(var(--rot)); 
              opacity: 1; 
            }
            75% { 
              transform: translate(var(--tx), -30px) rotate(var(--rot)); /* REBOTE HACIA ARRIBA */
            } 
            100% { 
              transform: translate(var(--tx), 0px) rotate(var(--rot)); /* ASENTAMIENTO FINAL */
            }
          }
        `}
      </style>

      {/* Parte Superior: El Juego (Torre de Libros) */}
      <div className="h-1/2 bg-blue-900 relative overflow-hidden flex flex-col items-center justify-end border-b-4 border-indigo-500 shadow-inner">
        
        <div className="absolute top-4 left-4 text-white/50 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm z-20">
          <span className="font-bold text-xl">Puntuación: {score}</span>
        </div>

        {/* Suelo de la torre */}
        <div className="w-64 h-4 bg-indigo-900 rounded-t-lg z-10 shadow-2xl flex-shrink-0"></div>

        {/* Contenedor de la pila */}
        <div className="flex flex-col-reverse items-center w-full h-full justify-start pb-0 overflow-y-hidden overflow-x-hidden relative z-0">
          {bookStack.map((book) => (
            <BookItem 
              key={book.id}
              width={book.width}
              color={book.color}
              offset={book.offset}
              rotation={book.rotation}
            />
          ))}
        </div>
      </div>

      {/* Parte Inferior: Preguntas */}
      <div className="h-1/2 bg-white p-6 flex flex-col items-center justify-center relative z-30">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
             <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Pregunta {currentQIndex + 1} de {questions.length}</span>
             <div className="text-xs text-gray-400">Progreso</div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50";
              
              if (selectedAnswer) {
                if (option === currentQuestion.correctAnswer) {
                  btnClass = "bg-green-100 border-green-500 text-green-700";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  btnClass = "bg-red-100 border-red-500 text-red-700";
                } else {
                  btnClass = "bg-gray-50 border-gray-100 text-gray-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnimating}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-xl font-medium text-left transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  {option}
                  {selectedAnswer && option === currentQuestion.correctAnswer && <Check size={20} />}
                  {selectedAnswer && option === selectedAnswer && option !== currentQuestion.correctAnswer && <X size={20} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Results Screen
const ResultsScreen = ({ score, totalQuestions, onAction }) => (
  <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 animate-fade-in">
    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-indigo-50">
      <div className="inline-block p-4 rounded-full bg-yellow-100 mb-6">
        <Trophy size={64} className="text-yellow-600" />
      </div>
      
      <h2 className="text-4xl font-bold text-blue-900 mb-2">¡Test Completado!</h2>
      <p className="text-gray-500 mb-8">Gran trabajo ampliando tu conocimiento.</p>
      
      <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
        <p className="text-sm text-indigo-400 uppercase font-bold tracking-wider mb-1">Puntuación Final</p>
        <p className="text-6xl font-black text-indigo-600">{score}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={() => onAction('ranking')}
          className="w-full py-3 px-6 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
        >
          <Trophy className="mr-2" size={20} /> Ver Ranking
        </button>
        
        <div className="flex gap-3">
            <button 
              onClick={() => onAction('retry')}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="mr-2" size={20} /> Repetir
            </button>
            <button 
              onClick={() => onAction('home')}
              className="flex-1 py-3 px-6 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <Home className="mr-2" size={20} /> Inicio
            </button>
        </div>
      </div>
    </div>
  </div>
);

// 6. Leaderboard
const Leaderboard = ({ userScore, onBack }) => {
    const sortedLeaderboard = [...MOCK_LEADERBOARD]
        .map(u => u.name === 'Tú' ? {...u, score: Math.max(u.score, userScore)} : u)
        .sort((a, b) => b.score - a.score);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-blue-900">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-3xl font-bold">Leaderboard</h2>
                    <p className="text-indigo-200">Ranking Semanal</p>
                </div>
                <div className="p-4">
                    {sortedLeaderboard.map((user, idx) => (
                        <div key={idx} className={`flex items-center p-4 mb-2 rounded-xl ${user.name === 'Tú' ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                                {idx + 1}
                            </div>
                            <div className="mr-4 text-2xl">{user.avatar}</div>
                            <div className="flex-1">
                                <h4 className={`font-bold ${user.name === 'Tú' ? 'text-indigo-700' : 'text-gray-800'}`}>{user.name}</h4>
                            </div>
                            <div className="font-mono font-bold text-gray-600">
                                {user.score} pts
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={onBack}
                        className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Volver a Inicio
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('landing');
  const [gameConfig, setGameConfig] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lo-fi-beat-chill-116491.mp3"; 
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked"));
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleStartApp = () => {
    setView('menu');
    if (!isPlayingMusic) {
        audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleSelectMode = (mode) => {
    if (mode === 'manual') {
      setView('selection');
    } else {
      setView('pdf_loading');
      setTimeout(() => {
        const questions = generateQuestions("Contenido del PDF", 15);
        setGeneratedQuestions(questions);
        setView('game');
      }, 3000);
    }
  };

  const handleSelectionComplete = (data) => {
    setGameConfig(data);
    const questions = generateQuestions(data.subject, data.count);
    setGeneratedQuestions(questions);
    setView('game');
  };

  const handleGameFinish = (score) => {
    setFinalScore(score);
    setView('results');
  };

  const handleResultAction = (action) => {
    if (action === 'ranking') {
      setView('ranking');
    } else if (action === 'retry') {
        const questions = generateQuestions(gameConfig?.subject || "PDF", gameConfig?.count || 15);
        setGeneratedQuestions(questions);
        setView('game');
    } else {
      setView('menu');
    }
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 overflow-hidden relative">
        {view !== 'landing' && (
            <button 
                onClick={toggleMusic}
                className="fixed top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md text-slate-800 rounded-full hover:bg-white/40 transition-all border border-white/30 shadow-sm"
            >
                {isPlayingMusic ? <Volume2 size={24} className={view === 'ranking' || view === 'game' && generatedQuestions.length > 0 ? "text-slate-800" : "text-blue-900"} /> : <VolumeX size={24} className="text-gray-500" />}
            </button>
        )}

        {view === 'landing' && <LandingPage onStart={handleStartApp} />}
        
        {view === 'menu' && <MainMenu onSelectMode={handleSelectMode} />}
        
        {view === 'selection' && <SelectionFlow onComplete={handleSelectionComplete} />}
        
        {view === 'pdf_loading' && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
                <h2 className="text-2xl font-bold text-blue-900">Analizando Documento...</h2>
                <p className="text-gray-500">Nuestra IA está preparando tus preguntas.</p>
            </div>
        )}

        {view === 'game' && (
            <GameInterface 
                questions={generatedQuestions} 
                onFinish={handleGameFinish} 
            />
        )}

        {view === 'results' && (
            <ResultsScreen 
                score={finalScore} 
                totalQuestions={generatedQuestions.length} 
                onAction={handleResultAction} 
            />
        )}

        {view === 'ranking' && (
            <Leaderboard 
                userScore={finalScore} 
                onBack={() => setView('menu')} 
            />
        )}
    </div>
  );
}
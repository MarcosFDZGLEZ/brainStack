import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from './components/Icons';
import { generateQuestions, SUBJECTS } from './data/utils'; // Importamos SUBJECTS también

// Importación de Vistas
import LandingPage from './views/LandingPage';
import MainMenu from './views/MainMenu';
import SelectionFlow from './views/SelectionFlow';
import GameInterface from './views/GameInterface';
import ResultsScreen from './views/ResultsScreen';
import Leaderboard from './views/Leaderboard';

export default function App() {
  const [view, setView] = useState('landing');
  const [gameConfig, setGameConfig] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // -- Lógica de Audio --
  useEffect(() => {
    const audioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lo-fi-beat-chill-116491.mp3"; 
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => { if(audioRef.current) audioRef.current.pause(); }
  }, []);

  const toggleMusic = () => {
    if (isPlayingMusic) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlayingMusic(!isPlayingMusic);
  };

  // -- Navegación y Generación de Preguntas --
  const handleStartApp = () => {
    setView('menu');
    if (!isPlayingMusic) audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
  };

  const generateAndStartGame = (subjectKey, count) => {
    setGameConfig({ subjectKey, count });
    // Usamos el subjectKey real del QuestionBank
    const questions = generateQuestions(subjectKey, count);
    setGeneratedQuestions(questions);
    setView('game');
  };

  const handleSelectMode = (mode) => {
    if (mode === 'manual') setView('selection');
    else {
      setView('pdf_loading');
      setTimeout(() => {
        // En modo PDF, usamos Historia como tópico por defecto para la demo
        const defaultSubjectKey = SUBJECTS.find(s => s.id === 'history').key;
        generateAndStartGame(defaultSubjectKey, 15);
      }, 3000);
    }
  };

  const handleSelectionComplete = (data) => {
    // Busca la clave real del QuestionBank usando el 'id' de la selección
    const subjectItem = SUBJECTS.find(s => s.id === data.subject);
    if (subjectItem) {
        generateAndStartGame(subjectItem.key, data.count);
    } else {
        console.error("Tópico no encontrado.");
        setView('menu');
    }
  };

  const handleResultAction = (action) => {
    if (action === 'ranking') setView('ranking');
    else if (action === 'retry') {
        // Reintentar usa la configuración guardada (subjectKey y count)
        if (gameConfig) {
             generateAndStartGame(gameConfig.subjectKey, gameConfig.count);
        } else {
             setView('menu'); // Fallback si no hay config
        }
    } else setView('menu');
  };

  return (
    <div className="h-screen w-full font-sans text-slate-800 overflow-hidden relative">
        {/* Control de Música Flotante */}
        {view !== 'landing' && (
            <button onClick={toggleMusic} className="fixed top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md text-slate-800 rounded-full hover:bg-white/40 transition-all border border-white/30 shadow-sm">
                {isPlayingMusic ? <Volume2 size={24} /> : <VolumeX size={24} className="text-gray-500" />}
            </button>
        )}

        {/* Router Básico */}
        {view === 'landing' && <LandingPage onStart={handleStartApp} />}
        {view === 'menu' && <MainMenu onSelectMode={handleSelectMode} />}
        {view === 'selection' && <SelectionFlow onComplete={handleSelectionComplete} />}
        
        {view === 'pdf_loading' && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
                <h2 className="text-2xl font-bold text-blue-900">Analizando Documento...</h2>
            </div>
        )}

        {view === 'game' && <GameInterface questions={generatedQuestions} onFinish={(s) => { setFinalScore(s); setView('results'); }} />}
        {view === 'results' && <ResultsScreen score={finalScore} onAction={handleResultAction} />}
        {view === 'ranking' && <Leaderboard userScore={finalScore} onBack={() => setView('menu')} />}
    </div>
  );
}
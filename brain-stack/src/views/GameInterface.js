import React, { useState, useEffect } from 'react';

// =============================================================
// 1. COMPONENTES DE ICONOS (LUCIDE-REACT SVGs)
// =============================================================

// Wrapper general para todos los iconos SVG
const IconWrapper = ({ children, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

// Icono de Check (para respuesta correcta)
const Check = (props) => (
  <IconWrapper {...props}><polyline points="20 6 9 17 4 12"></polyline></IconWrapper>
);
// Icono de X (para respuesta incorrecta)
const X = (props) => (
  <IconWrapper {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconWrapper>
);


// =============================================================
// 2. COMPONENTE BOOK ITEM
// =============================================================

/**
 * Componente que representa un libro que cae.
 */
const BookItem = ({ id, isCorrect, color, offset, rotation, width, bottomPosition }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Iniciar la animación de caída al montar el componente
        setIsVisible(true);
    }, []);

    return (
        <div 
            className={`absolute transition-all duration-700 ease-out 
                        h-4 flex items-center justify-center rounded-sm shadow-md border border-black/10
                        ${width} ${color} 
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-100vh] opacity-0'}`}
            style={{
                // Usamos la posición bottom calculada desde el padre para permitir que caigan al suelo
                bottom: `${bottomPosition}px`,
                transform: `translateX(${offset}px) rotate(${rotation}deg)`,
                // Aseguramos que id sea un número para evitar NaN en zIndex
                zIndex: 10 + (Number(id) || 0), 
                boxShadow: '2px 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}
        >
            {/* Detalles del lomo del libro para realismo */}
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black/10"></div>
            <span className="text-white text-[10px] font-bold opacity-90 select-none drop-shadow-md">
                {isCorrect ? '✔' : '✘'}
            </span>
        </div>
    );
};

// =============================================================
// 3. VISTA PRINCIPAL (GAME INTERFACE)
// =============================================================

const GameInterface = ({ questions, onFinish }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bookStack, setBookStack] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Contadores para las cuatro torres laterales de libros incorrectos
  const [incorrectStacks, setIncorrectStacks] = useState([0, 0, 0, 0]); // Cuatro contadores

  const currentQuestion = questions[currentQIndex];

  const BASE_BOOK_HEIGHT = 16; // h-4 en Tailwind
  const BLUE_BASE_HEIGHT = 16; // h-4 de la base azul
  const BLUE_BASE_BOTTOM_PX = 80; // bottom-20 de la base azul (80px)

  // Calcula la posición inicial del apilamiento central (sobre la base azul)
  const START_STACK_BOTTOM = BLUE_BASE_BOTTOM_PX + BLUE_BASE_HEIGHT; // 80 + 16 = 96px

  // La posición base para las torres incorrectas (apiladas en el suelo)
  const START_SIDE_STACK_BOTTOM = 20; // 20px de margen sobre el suelo (bottom-0)

  // Definición de las posiciones X (offset) para las 4 torres laterales
  // Se aumentan los valores para dar más espacio entre las torres.
  const INCORRECT_OFFSETS = [
    -300, // Torre 1 (Extrema Izquierda)
    -150, // Torre 2 (Media Izquierda)
     150, // Torre 3 (Media Derecha)
     300, // Torre 4 (Extrema Derecha)
  ];

  const handleAnswer = (answer) => {
    if (isAnimating || selectedAnswer) return;
    setSelectedAnswer(answer);
    setIsAnimating(true);

    // Verificación
    const isCorrect = answer === currentQuestion.correctAnswerText;
    const points = isCorrect ? 100 : 0;
    
    // --- LÓGICA DE POSICIONAMIENTO DE LIBROS ---
    const correctBooksCount = bookStack.filter(b => b.isCorrect).length;
    
    let calcOffset, calcBottom, calcRotation, calcWidth, calcColor;
    let newIncorrectStacks = [...incorrectStacks]; // Copia de los contadores

    if (isCorrect) {
        // SI ES CORRECTO: Va a la torre central
        calcBottom = (correctBooksCount * BASE_BOOK_HEIGHT) + START_STACK_BOTTOM; 
        calcOffset = Math.random() * 10 - 5; // Ligeramente desalineado
        calcRotation = Math.random() * 4 - 2; // Ligera rotación
        calcColor = ['bg-emerald-500', 'bg-green-600', 'bg-teal-500'][Math.floor(Math.random()*3)];
        calcWidth = 'w-48'; 
    } else {
        // SI ES INCORRECTO: Va a una de las 4 torres laterales.
        
        // 1. Encontrar el índice de la torre más baja (con menor número de libros)
        const minCount = Math.min(...incorrectStacks);
        let stackIndex = incorrectStacks.indexOf(minCount);

        // Si todas están llenas o por alguna razón no se encuentra, usar una aleatoria
        if (stackIndex === -1) {
          stackIndex = Math.floor(Math.random() * 4);
        }

        // 2. Calcular la posición
        const count = incorrectStacks[stackIndex];
        calcBottom = (count * BASE_BOOK_HEIGHT) + START_SIDE_STACK_BOTTOM; 
        calcOffset = INCORRECT_OFFSETS[stackIndex] + (Math.random() * 8 - 4); // Posición de la torre + ligero desalineamiento
        calcRotation = Math.random() * 4 - 2; // Rotación mínima para un apilamiento ordenado (casi rectos)

        calcColor = ['bg-red-500', 'bg-rose-600', 'bg-orange-700'][Math.floor(Math.random()*3)];
        calcWidth = 'w-44';
        
        // 3. Incrementar el contador de la torre seleccionada
        newIncorrectStacks[stackIndex]++;
        setIncorrectStacks(newIncorrectStacks);
    }

    const newBook = {
      id: currentQIndex,
      isCorrect: isCorrect,
      color: calcColor,
      offset: calcOffset,
      bottomPosition: calcBottom,
      rotation: calcRotation,
      width: calcWidth,
    };
    // ---------------------------------------------

    setScore(prev => prev + points);
    setBookStack(prev => [...prev, newBook]);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnimating(false);
      } else {
        // Pasamos la puntuación final al componente padre
        onFinish(score + points); 
      }
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Zona Superior: Juego */}
      <div className="h-1/2 bg-blue-900 relative overflow-hidden flex flex-col items-center justify-end border-b-4 border-indigo-500 shadow-inner">
        
        {/* Estantería Izquierda */}
        <div 
          className="absolute top-0 left-0 h-full w-[30%] md:w-[25%] bg-no-repeat bg-left bg-top"
          style={{ 
              backgroundImage: "url('https://images.vexels.com/media/users/3/129063/isolated/preview/a0f2d9a7ba039a19e41707b4c3e3a768-icono-de-estanteria-de-madera.png')", // REEMPLAZA ESTA RUTA POR LA RUTA REAL DE TU IMAGEN
              backgroundSize: "contain"
          }}
        ></div>
        
        {/* Estantería Derecha */}
        <div 
          className="absolute top-0 right-0 h-full w-[30%] md:w-[25%] bg-no-repeat bg-right bg-top"
          style={{ 
              backgroundImage: "url('https://images.vexels.com/media/users/3/129063/isolated/preview/a0f2d9a7ba039a19e41707b4c3e3a768-icono-de-estanteria-de-madera.png')", // REEMPLAZA ESTA RUTA POR LA RUTA REAL DE TU IMAGEN
              backgroundSize: "contain"
          }}
        ></div>

        <div className="absolute top-4 left-4 text-white/50 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm z-20">
          <span className="font-bold text-xl">Score: {score}</span>
        </div>

        {/* Suelo de la torre (Base visual) */}
        <div className="w-full h-5 absolute bottom-0 bg-indigo-950 z-10 border-t border-white/10"></div>
        {/* Base de la torre (Base azul) */}
        <div className="w-52 h-4 bg-indigo-800 rounded-t-sm z-10 shadow-2xl absolute bottom-[80px]"></div>

        <div className="flex flex-col-reverse items-center w-full h-full justify-start pb-0 overflow-y-hidden overflow-x-hidden relative z-0">
          {/* Stack de Libros */}
          {bookStack.map((book) => (
            <BookItem key={book.id} {...book} />
          ))}
        </div>
      </div>

      {/* Zona Inferior: Preguntas */}
      <div className="h-1/2 bg-white p-6 flex flex-col items-center justify-center relative z-30">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Question {currentQIndex + 1} from {questions.length}</span>
            <div className="text-xs text-gray-400">Progress</div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-tight">
            {currentQuestion.question} 
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50";
              
              if (selectedAnswer) {
                if (option === currentQuestion.correctAnswerText) { 
                  btnClass = "bg-green-100 border-green-500 text-green-700";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswerText) {
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
                  {selectedAnswer && option === currentQuestion.correctAnswerText && <Check size={20} />}
                  {selectedAnswer && option === selectedAnswer && option !== currentQuestion.correctAnswerText && <X size={20} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
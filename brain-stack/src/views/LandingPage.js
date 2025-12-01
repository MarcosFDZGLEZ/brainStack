import React from 'react';
import { BookIcon } from '../components/Icons';

const LandingPage = ({ onStart }) => (
  <div 
    onClick={onStart}
    className="h-screen w-full bg-blue-900 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-950 transition-colors duration-500 text-white relative overflow-hidden"
  >
    {/* Fondo animado con iconos de libros */}
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <BookIcon key={i} className="absolute animate-bounce" style={{ 
          top: `${Math.random() * 100}%`, 
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 3}s`
        }} />
      ))}
    </div>
    
    {/* Contenido Principal: BrainStack */}
    <div className="z-10 flex flex-col items-center animate-pulse">
      {/* CONTENEDOR FLEX HORIZONTAL
          - flex-row: Alinea los elementos en una fila.
          - items-center: Centra verticalmente el icono y el texto.
          - gap-4: Añade un espacio entre las dos imágenes.
      */}
      <div className="flex flex-row items-center justify-center gap-4 mb-6">
        {/* Icono de BrainStack (más pequeño ahora) */}
        <img 
          src="/brainstack_icono-fondo_positivo.png" 
          alt="BrainStack Icon" 
          className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-2xl"
        />
        
        {/* Logo de Texto BrainStack (más grande) */}
        <img 
          src="/brainstack_logo-largo_blanco.png" 
          alt="BrainStack" 
          className="h-16 md:h-24 object-contain"
        />
      </div>

      {/* Slogan - Tipografía cambiada a sans-serif y negrita sutil */}
      <p className="text-2xl text-indigo-200 font-semibold tracking-widest uppercase">
        Where Learning Sticks
      </p>
    </div>
    
    <div className="absolute bottom-20 text-indigo-300 text-lg animate-bounce">
      Click Anywhere To Start
    </div>
  </div>
);

export default LandingPage;
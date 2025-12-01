import React, { useEffect, useState } from 'react';

/**
 * Componente que representa un libro en el stack de la interfaz de juego.
 * Muestra el resultado (correcto/incorrecto) con una animación de caída.
 */
const BookItem = ({ id, isCorrect, color, offset, rotation, width, bottomPosition }) => {
    // isVisible determina si el libro está en su posición final (translate-y-0)
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Calculamos un retardo basado en el ID para que la caída sea escalonada.
        // Esto crea un efecto visual de que cada libro cae justo después del anterior.
        const delay = (id - 1) * 50; 

        const timer = setTimeout(() => {
            // Iniciar la animación de caída al montar el componente después del retardo
            setIsVisible(true);
        }, 100 + delay); // 100ms inicial + delay incremental

        return () => clearTimeout(timer); // Limpieza del temporizador
    }, [id]);

    return (
        <div 
            // La clase 'transition-all' es clave para que 'duration-700' y 'ease-out' funcionen
            // isVisible: false -> translate-y-[-100vh] (fuera de pantalla)
            // isVisible: true -> translate-y-0 (posición final)
            className={`absolute transition-all duration-700 ease-out 
                        h-4 flex items-center justify-center rounded-sm shadow-md border border-black/10
                        ${width} ${color} 
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-100vh] opacity-0'}`}
            style={{
                // La posición 'bottom' es la posición final en la pila
                bottom: `${bottomPosition}px`,
                // El 'transform' horizontal y la rotación se aplican siempre
                transform: `translateX(${offset}px) rotate(${rotation}deg)`,
                // Corrección: Aseguramos que id sea un número para evitar NaN en zIndex
                zIndex: 10 + (Number(id) || 0), 
                boxShadow: '2px 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}
        >
            {/* Detalles del lomo del libro para realismo */}
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black/10"></div>
            <span className="text-white text-[10px] font-bold select-none" style={{textShadow: '0 0 2px rgba(0,0,0,0.5)'}}>
                {isCorrect ? 'OK' : 'X'}
            </span>
        </div>
    );
};

export default BookItem;
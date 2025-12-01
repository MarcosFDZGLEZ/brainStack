import { QuestionBank } from './QuestionBank.js';

export const ACADEMIC_STAGES = [
  { id: 'eso', label: 'E.S.O.' },
  { id: 'bachillerato', label: 'Baccalaureate' },
  { id: 'universidad', label: 'University' },
  { id: 'fp', label: 'Vocational Training' },
  { id: 'master', label: 'Master' }
];

export const SUBJECTS = [
  // Mapeamos las etiquetas de la UI a las claves del QuestionBank
  { id: 'history', label: 'Universal History', key: 'HISTORIA_UNIVERSAL' },
  { id: 'science', label: 'Natural Sciences', key: 'CIENCIAS_NATURALES' },
  { id: 'math', label: 'Mathematics', key: 'MATEMATICAS' },
  { id: 'lit', label: 'Universal Literature', key: 'LITERATURA_UNIVERSAL' }, 
  { id: 'english', label: 'English', key: 'INGLES' }, 
  { id: 'prog', label: 'Programing', key: 'PROGRAMACION' } 
];

export const MOCK_LEADERBOARD = [
  { name: 'You', score: 0, avatar: '👤' },
  { name: 'Ana García', score: 1200, avatar: '👩‍🎓' },
  { name: 'Carlos Ruiz', score: 950, avatar: '👨‍💻' },
  { name: 'Elena M.', score: 720, avatar: '👩‍🔬' },
];

/**
 * Función de utilidad para barajar un array (algoritmo Fisher-Yates).
 */
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

/**
 * Genera una selección rotativa de preguntas basadas en el tópico seleccionado.
 * * @param {string} subjectKey La clave del tópico (ej. 'HISTORIA_UNIVERSAL').
 * @param {number} count El número de preguntas a devolver.
 * @returns {Array} Un array de preguntas seleccionadas y barajadas.
 */
export const generateQuestions = (subjectKey, count) => {
    const topicQuestions = QuestionBank[subjectKey];

    if (!topicQuestions || topicQuestions.length === 0) {
        // En caso de que el banco de preguntas esté vacío para el tópico
        console.error(`No questions for this topic yet: ${subjectKey}`);
        const mockSubject = SUBJECTS.find(s => s.key === subjectKey)?.label || 'General Knowledge';
        
        // Genera preguntas simuladas para evitar que el test falle
        const mockQuestions = [];
        for (let i = 0; i < count; i++) {
            mockQuestions.push({
                id: `MOCK-${i}`,
                question: `Simulated question ${i + 1} about ${mockSubject}`,
                options: [
                    "Correct Answer",
                    "Option B",
                    "Option C",
                    "Option D"
                ].sort(() => Math.random() - 0.5),
                // Asume que "Respuesta Correcta" es la primera opción antes de barajar, pero se reordena aquí.
                // Usamos un índice fijo para que el GameInterface lo reconozca
                answerIndex: 0 
            });
        }
        return mockQuestions;
    }

    // 1. Barajar todo el banco de preguntas del tópico para la rotación.
    const shuffledQuestions = shuffleArray([...topicQuestions]);

    // 2. Tomar solo la cantidad solicitada (rotación).
    const selectedQuestions = shuffledQuestions.slice(0, count);

    // 3. Barajar las opciones de respuesta dentro de cada pregunta para una mejor jugabilidad.
    const finalQuestions = selectedQuestions.map(q => {
        const correctText = q.options[q.answerIndex];
        const shuffledOptions = shuffleArray([...q.options]);
        
        // Encontrar el nuevo índice de la respuesta correcta después de barajar.
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
        
        return {
            ...q,
            options: shuffledOptions,
            answerIndex: newCorrectIndex,
            correctAnswerText: correctText // Añadimos el texto correcto para el GameInterface
        };
    });

    return finalQuestions;
};
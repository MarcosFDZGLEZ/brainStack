import React from 'react';
import { Trophy, RotateCcw, Home } from '../components/Icons';

const ResultsScreen = ({ score, onAction }) => (
  <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 animate-fade-in">
    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-indigo-50">
      <div className="inline-block p-4 rounded-full bg-yellow-100 mb-6">
        <Trophy size={64} className="text-yellow-600" />
      </div>
      
      <h2 className="text-4xl font-bold text-blue-900 mb-2">¡Test Completed!</h2>
      <p className="text-gray-500 mb-8">Great work stacking your Knowledge.</p>
      
      <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
        <p className="text-sm text-indigo-400 uppercase font-bold tracking-wider mb-1">Puntuación Final</p>
        <p className="text-6xl font-black text-indigo-600">{score}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button 
          onClick={() => onAction('ranking')}
          className="w-full py-3 px-6 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center"
        >
          <Trophy className="mr-2" size={20} /> Show Ranking
        </button>
        
        <div className="flex gap-3">
            <button 
              onClick={() => onAction('retry')}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="mr-2" size={20} /> Retry
            </button>
            <button 
              onClick={() => onAction('home')}
              className="flex-1 py-3 px-6 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <Home className="mr-2" size={20} /> Main Menu
            </button>
        </div>
      </div>
    </div>
  </div>
);

export default ResultsScreen;
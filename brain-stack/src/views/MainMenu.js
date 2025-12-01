import React from 'react';
import { Upload, BookIcon } from '../components/Icons';

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
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload your PDF</h3>
        <p className="text-gray-500 text-center">Upload your theory and get personalized questions</p>
      </button>

      <button 
        onClick={() => onSelectMode('manual')}
        className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-blue-500 flex flex-col items-center"
      >
        <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
          <BookIcon size={48} className="text-blue-600 group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Manual Selection</h3>
        <p className="text-gray-500 text-center">Choose your course, subject and number of questions</p>
      </button>
    </div>
  </div>
);

export default MainMenu;
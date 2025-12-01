import React, { useState } from 'react';
import { GraduationCap, Play } from '../components/Icons';
import { ACADEMIC_STAGES, SUBJECTS } from '../data/utils';

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
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">What academic stage are you in?</h3>
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
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Select the Subject</h3>
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
            <h3 className="text-2xl font-bold text-blue-900 mb-8">How many questions do you want?</h3>
            <div className="mb-8">
              <span className="text-6xl font-black text-indigo-600">{data.count}</span>
              <span className="text-gray-400 ml-2">Questions</span>
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

export default SelectionFlow;
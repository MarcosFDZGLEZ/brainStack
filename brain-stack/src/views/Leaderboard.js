import React from 'react';
import { MOCK_LEADERBOARD } from '../data/utils';

const Leaderboard = ({ userScore, onBack }) => {
    // Calculamos el ranking al vuelo
    const sortedLeaderboard = [...MOCK_LEADERBOARD]
        .map(u => u.name === 'You' ? {...u, score: Math.max(u.score, userScore)} : u)
        .sort((a, b) => b.score - a.score);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-blue-900">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-3xl font-bold">Leaderboard</h2>
                    <p className="text-indigo-200">Weakly Ranking</p>
                </div>
                <div className="p-4">
                    {sortedLeaderboard.map((user, idx) => (
                        <div key={idx} className={`flex items-center p-4 mb-2 rounded-xl ${user.name === 'You' ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                                {idx + 1}
                            </div>
                            <div className="mr-4 text-2xl">{user.avatar}</div>
                            <div className="flex-1">
                                <h4 className={`font-bold ${user.name === 'You' ? 'text-indigo-700' : 'text-gray-800'}`}>{user.name}</h4>
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
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;
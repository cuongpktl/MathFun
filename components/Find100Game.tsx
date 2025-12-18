
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateFind100Problems } from '../services/mathUtils';
import { audioService } from '../services/audioService';
import { RefreshIcon, StarIcon } from './icons';

const Find100Game: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const initGame = () => {
    audioService.play('click');
    setProblems(generateFind100Problems(8));
    setSelectedIds([]);
    setScore(0);
    setRevealed(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const toggleSelect = (id: string) => {
    if (revealed) return;
    audioService.play('click');
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const checkGame = () => {
    let newScore = 0;
    let allRightSelected = true;
    
    selectedIds.forEach(id => {
      const p = problems.find(prob => prob.id === id);
      if (p && p.isCorrect) newScore += 10;
      else {
          newScore -= 5;
          allRightSelected = false;
      }
    });

    if (allRightSelected && selectedIds.length > 0) {
        audioService.play('correct');
    } else {
        audioService.play('wrong');
    }

    setScore(newScore);
    setRevealed(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 no-select">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-gray-800">Tìm Phép Tính = 100</h2>
            <p className="text-gray-500 text-sm">Chỉ chọn những thẻ có tổng bằng 100</p>
        </div>
        <div className="flex items-center gap-4">
            {revealed && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">
                    <StarIcon fill="currentColor" className="w-4 h-4" />
                    <span>+{score} điểm</span>
                </div>
            )}
            <button onClick={initGame} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100">
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map(p => {
            const isSelected = selectedIds.includes(p.id);
            const isCorrectTarget = p.isCorrect;
            
            let cardStyle = "bg-white border-gray-100 hover:border-indigo-300";
            if (revealed) {
                if (isCorrectTarget) {
                    cardStyle = isSelected ? "bg-green-100 border-green-500 ring-4 ring-green-100" : "bg-white border-green-200 border-dashed opacity-70"; 
                } else {
                    cardStyle = isSelected ? "bg-red-100 border-red-500" : "bg-gray-50 border-transparent opacity-40";
                }
            } else {
                if (isSelected) cardStyle = "bg-indigo-50 border-indigo-500 ring-4 ring-indigo-100 scale-105 z-10";
            }

            return (
                <button
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    className={`h-24 sm:h-28 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all shadow-md active:scale-95 ${cardStyle}`}
                >
                    {p.numbers?.[0]} + {p.numbers?.[1]}
                </button>
            )
        })}
      </div>

      <div className="mt-12 text-center pb-10">
          {!revealed ? (
            <button 
                onClick={checkGame}
                disabled={selectedIds.length === 0}
                className="w-full sm:w-auto px-12 py-4 bg-indigo-600 text-white text-lg font-black rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
                Kiểm Tra Kết Quả
            </button>
          ) : (
            <div className="text-gray-600 font-bold text-lg animate-fadeIn">
                {score > 10 ? "Bé giỏi quá! 🥳" : "Cố gắng hơn lần sau nhé! 💪"}
                <button onClick={initGame} className="block mx-auto mt-4 text-indigo-600 underline">Chơi lại ván mới</button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Find100Game;

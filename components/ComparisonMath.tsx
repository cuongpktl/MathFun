
import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ComparisonMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [showSelector, setShowSelector] = useState(false);
  const nums = problem.numbers || [0, 0, 0, 0];
  const userAns = problem.userAnswer || '';
  const isCorrect = showResult && userAns === problem.answer;
  const isWrong = showResult && userAns !== '' && !isCorrect;

  const handleSelect = (val: string) => {
    if (showResult) return;
    onUpdate(val);
    setShowSelector(false);
  };

  const SYMBOLS = ['>', '<', '='];

  return (
    <div className={`p-6 rounded-3xl border-2 flex flex-col items-center bg-white shadow-sm transition-all duration-300 relative ${
        showResult ? (isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : 'border-indigo-100 hover:border-indigo-300'
    }`}>
      <div className="flex items-center gap-4 sm:gap-8 w-full justify-center">
        {/* Left Side */}
        <div className="flex items-center gap-2 text-2xl font-black text-gray-700 font-mono bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <span>{nums[0]}</span>
            <span className="text-indigo-400 text-xl">+</span>
            <span>{nums[1]}</span>
        </div>

        {/* Comparison Circle */}
        <div className="relative">
            <button 
                onClick={() => !showResult && setShowSelector(!showSelector)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center text-3xl font-black transition-all shadow-md z-10 relative
                    ${userAns ? 'text-indigo-600 border-indigo-500 bg-white' : 'text-gray-300 border-gray-100 bg-gray-50'}
                    ${isCorrect ? 'border-green-500 text-green-600' : ''}
                    ${isWrong ? 'border-red-500 text-red-600 animate-shake' : ''}
                    ${!showResult && !userAns ? 'hover:border-indigo-300 animate-pulse' : ''}
                `}
            >
                {userAns || '?'}
            </button>

            {/* Selection Menu */}
            {showSelector && !showResult && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border-2 border-indigo-200 rounded-[24px] shadow-2xl flex p-2 gap-2 z-50 animate-fadeIn overflow-hidden">
                    {SYMBOLS.map(sym => (
                        <button 
                            key={sym} 
                            onClick={() => handleSelect(sym)}
                            className="w-12 h-12 flex items-center justify-center text-2xl font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors active:scale-90"
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 text-2xl font-black text-gray-700 font-mono bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <span>{nums[2]}</span>
            <span className="text-indigo-400 text-xl">+</span>
            <span>{nums[3]}</span>
        </div>
      </div>

      {showResult && !isCorrect && (
          <div className="absolute -top-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
             Đúng là: {problem.answer}
          </div>
      )}
    </div>
  );
};

export default ComparisonMath;

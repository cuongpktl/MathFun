
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const FillBlankMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const hideIndex = problem.options?.[0] ?? 2; // 0: num1, 1: num2, 2: result
  
  const op = problem.operators?.[0] || '+';
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  const res = op === '+' ? a + b : a - b;

  const renderBox = (val: number, isHidden: boolean) => {
    if (isHidden) {
      return (
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={problem.userAnswer || ''}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl font-black rounded-2xl border-4 shadow-inner outline-none transition-all ${
              showResult 
              ? (isCorrect ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700') 
              : 'bg-white border-indigo-300 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
            }`}
            placeholder="?"
          />
          {showResult && !isCorrect && (
            <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg animate-bounce-short z-10">
              {problem.answer}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-black rounded-2xl bg-white border-4 border-gray-100 text-gray-700 shadow-sm">
        {val}
      </div>
    );
  };

  // Logic sinh gợi ý (Hint logic) cho bé tư duy
  let hint = "";
  if (hideIndex === 0) { // ? [op] b = res
    hint = op === '+' ? `${res} - ${b} = ?` : `${res} + ${b} = ?`;
  } else if (hideIndex === 1) { // a [op] ? = res
    hint = op === '+' ? `${res} - ${a} = ?` : `${a} - ${res} = ?`;
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className={`bg-indigo-50 p-6 sm:p-8 rounded-[40px] border-4 border-dashed transition-all ${showResult && !isCorrect ? 'border-red-200 bg-red-50' : 'border-indigo-200'} flex flex-wrap justify-center items-center gap-3 sm:gap-6 relative overflow-hidden shadow-sm`}>
        {renderBox(a, hideIndex === 0)}
        <div className="text-3xl font-black text-indigo-400">{op}</div>
        {renderBox(b, hideIndex === 1)}
        <div className="text-3xl font-black text-indigo-400">=</div>
        {renderBox(res, hideIndex === 2)}
        
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-100 rounded-full opacity-40"></div>
      </div>

      {hint && !showResult && (
        <div className="flex justify-center animate-bounce-short">
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-2xl text-xs font-black uppercase flex items-center gap-2 border-2 border-amber-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            Gợi ý: {hint}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillBlankMath;


import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const FillBlankMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const hideIndex = problem.options?.[0] || 0; // 0: first, 1: second, 2: result
  
  const op = problem.operators?.[0] || '+';
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  let res = 0;
  if(op === '+') res = a + b;
  else res = a - b;

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
                    className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl font-bold rounded-lg border-2 shadow-inner outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${
                        showResult 
                        ? (isCorrect ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700') 
                        : 'bg-white border-indigo-300 text-gray-800'
                    }`}
                    placeholder="?"
                />
                 {showResult && !isCorrect && (
                     <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow animate-bounce-short">
                         {problem.answer}
                     </div>
                 )}
             </div>
          );
      }
      return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-bold rounded-lg bg-white border-2 border-gray-200 text-gray-700 shadow-sm">
              {val}
          </div>
      );
  }

  // Logic sinh gợi ý (Hint logic)
  let hint = "";
  if (hideIndex === 0) { // ? [op] b = res
    if (op === '+') hint = `${res} - ${b} = ?`;
    else hint = `${res} + ${b} = ?`;
  } else if (hideIndex === 1) { // a [op] ? = res
    if (op === '+') hint = `${res} - ${a} = ?`;
    else hint = `${a} - ${res} = ?`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={`bg-indigo-50 p-6 rounded-3xl border-dashed border-2 transition-colors ${showResult && !isCorrect ? 'border-red-200' : 'border-indigo-200'} flex flex-wrap justify-center items-center gap-2 sm:gap-4 relative overflow-hidden`}>
          {renderBox(a, hideIndex === 0)}
          <div className="text-2xl font-black text-indigo-400">{op}</div>
          {renderBox(b, hideIndex === 1)}
          <div className="text-2xl font-black text-indigo-400">=</div>
          {renderBox(res, hideIndex === 2)}

          {/* Trang trí góc thẻ */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-100 rounded-bl-3xl opacity-50"></div>
      </div>

      {/* Hiển thị gợi ý nếu ô trống nằm bên trái dấu = */}
      {hint && !showResult && (
        <div className="flex items-center gap-2 justify-center animate-fadeIn">
          <div className="bg-yellow-100 text-yellow-700 p-2 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-2 shadow-sm border border-yellow-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            Gợi ý: {hint}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillBlankMath;

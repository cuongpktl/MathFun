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
  
  const renderBox = (val: number, isHidden: boolean) => {
      if (isHidden) {
          return (
             <div className="relative">
                <input
                    type="number"
                    value={problem.userAnswer || ''}
                    onChange={(e) => onUpdate(e.target.value)}
                    disabled={showResult}
                    className={`w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl font-bold rounded-lg border-2 shadow-inner outline-none focus:ring-2 focus:ring-indigo-300 ${
                        showResult 
                        ? (isCorrect ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700') 
                        : 'bg-white border-indigo-300 text-gray-800'
                    }`}
                    placeholder="?"
                />
                 {showResult && !isCorrect && (
                     <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow">
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

  // Determine what numbers to show
  // If hideIndex 0: ? + b = res
  // If hideIndex 1: a + ? = res
  // If hideIndex 2: a + b = ?
  
  // Reconstruct the display numbers. 
  // problem.numbers has [a, b]. problem.answer is the hidden value. 
  // We need the full equation parts.
  
  const op = problem.operators?.[0] || '+';
  const a = problem.numbers?.[0] || 0;
  const b = problem.numbers?.[1] || 0;
  let res = 0;
  if(op === '+') res = a + b;
  else res = a - b;

  return (
    <div className="bg-indigo-50 p-6 rounded-2xl border-dashed border-2 border-indigo-200 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        {renderBox(a, hideIndex === 0)}
        <div className="text-2xl font-black text-indigo-400">{op}</div>
        {renderBox(b, hideIndex === 1)}
        <div className="text-2xl font-black text-indigo-400">=</div>
        {renderBox(res, hideIndex === 2)}
    </div>
  );
};

export default FillBlankMath;
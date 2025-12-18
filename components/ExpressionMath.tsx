import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ExpressionMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  return (
    <div className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row items-center gap-4 bg-white shadow-sm transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-purple-100 hover:border-purple-300'}`}>
        <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-700 font-mono">
            <span>{problem.numbers?.[0]}</span>
            <span className="text-purple-500">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]}</span>
            <span className="text-purple-500">{problem.operators?.[1]}</span>
            <span>{problem.numbers?.[2]}</span>
            <span className="text-gray-400">=</span>
        </div>
        
        <div className="relative">
            <input 
                type="number" 
                inputMode="numeric"
                value={problem.userAnswer || ''}
                onChange={(e) => onUpdate(e.target.value)}
                disabled={showResult}
                className={`w-24 text-center text-2xl font-bold p-2 rounded-lg border-2 outline-none focus:ring-2 focus:ring-purple-300 ${
                    showResult 
                    ? (isCorrect ? 'text-green-600 border-green-200 bg-green-100' : 'text-red-500 border-red-200 bg-red-100') 
                    : 'text-gray-800 border-gray-300 bg-gray-50'
                }`}
                placeholder="?"
            />
            {isWrong && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap z-10">
                    KQ: {problem.answer}
                </div>
            )}
        </div>
    </div>
  );
};

export default ExpressionMath;
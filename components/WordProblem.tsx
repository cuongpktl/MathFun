import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateWordProblem } from '../services/geminiService';
import { RefreshIcon, CheckCircleIcon, StarIcon } from './icons';

const WordProblem: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  // State to track the next operator to enable alternating
  const [nextOperator, setNextOperator] = useState<'+' | '-'>('+');

  const loadProblem = async () => {
    setLoading(true);
    setStatus('idle');
    setInput('');
    
    // Request a problem with the current nextOperator
    const p = await generateWordProblem(nextOperator);
    setProblem(p);
    
    // Toggle the operator for the next call to ensure variety (Addition -> Subtraction)
    setNextOperator(prev => (prev === '+' ? '-' : '+'));
    
    setLoading(false);
  };

  useEffect(() => {
    loadProblem();
  }, []);

  const checkAnswer = () => {
    if (!problem) return;
    if (parseInt(input) === problem.answer) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-lg border-b-4 border-yellow-400 overflow-hidden relative">
        <div className="bg-yellow-100 p-4 border-b border-yellow-200 flex justify-between items-center">
             <h2 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                <StarIcon className="text-yellow-500" fill="currentColor" />
                Đố Em Biết?
             </h2>
             <button 
                onClick={loadProblem} 
                disabled={loading}
                className="p-2 bg-white rounded-full shadow-sm hover:shadow text-yellow-600 transition-transform active:scale-95 disabled:opacity-50"
             >
                 <RefreshIcon className={loading ? "animate-spin" : ""} />
             </button>
        </div>
        
        <div className="p-8">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ) : problem ? (
                <div className="space-y-6">
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                        {problem.question}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                        <label className="text-gray-500 font-bold">Trả lời:</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                disabled={status === 'correct'}
                                className={`w-32 text-center text-3xl font-bold p-3 rounded-xl border-2 outline-none focus:ring-4 transition-all ${
                                    status === 'correct' ? 'border-green-500 bg-green-50 text-green-700' :
                                    status === 'wrong' ? 'border-red-500 bg-red-50 text-red-700 ring-red-200' :
                                    'border-gray-300 bg-gray-50 focus:border-yellow-400 focus:ring-yellow-200'
                                }`}
                            />
                            {status === 'correct' && (
                                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-green-500">
                                    <CheckCircleIcon className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={checkAnswer}
                            className="w-full sm:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-[4px] transition-all"
                        >
                            Kiểm Tra
                        </button>
                    </div>

                    {status === 'wrong' && (
                        <div className="bg-red-50 p-4 rounded-xl text-red-600 text-center animate-shake">
                            Chưa đúng rồi, bé hãy tính lại nhé!
                        </div>
                    )}
                    
                    {status === 'correct' && (
                        <div className="bg-green-100 p-6 rounded-xl text-green-700 text-center font-bold text-lg animate-bounce-short">
                            🎉 Hoan hô! Bé làm giỏi quá!
                            <button onClick={loadProblem} className="block mx-auto mt-2 text-sm text-green-600 underline">Bài tiếp theo</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-400">Không thể tải câu hỏi.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WordProblem;
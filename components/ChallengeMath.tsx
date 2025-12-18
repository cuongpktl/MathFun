import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const ChallengeMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sourceShapes = [], options = [] } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
    ? problem.visualData 
    : {};
    
  const userChoice = problem.userAnswer || '';
  const isCorrect = showResult && userChoice === problem.answer;
  const isWrong = showResult && userChoice !== '' && !isCorrect;

  const handleSelect = (id: string) => {
    if (showResult) return;
    onUpdate(id);
  };

  if (!sourceShapes.length && !options.length) return null;

  return (
    <div className="bg-white p-8 rounded-[40px] border-4 border-rose-100 shadow-2xl flex flex-col items-center w-full max-w-3xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-10 text-center leading-tight">
        {problem.question}
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
        {/* Source Section */}
        <div className="flex flex-col items-center bg-rose-50 p-6 rounded-[32px] border-2 border-rose-200 shadow-inner w-full lg:w-1/2">
          <p className="text-sm font-black text-rose-500 mb-4 uppercase tracking-widest">Mảnh bìa cho sẵn</p>
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                {sourceShapes.map((s: any) => (
                    <path key={s.id} d={s.d} fill={s.color} stroke="#365314" strokeWidth="2" />
                ))}
             </svg>
          </div>
        </div>

        {/* Options Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-1/2">
           {options.map((opt: any) => {
               const isSelected = userChoice === opt.id;
               const showCorrect = showResult && opt.id === problem.answer;
               const showWrong = showResult && isSelected && !isCorrect;
               
               let btnClass = "relative group flex flex-col items-center p-4 rounded-3xl border-4 transition-all duration-300 active:scale-95 ";
               if (showResult) {
                   if (showCorrect) btnClass += "border-green-500 bg-green-50 shadow-green-100 scale-105 ";
                   else if (showWrong) btnClass += "border-red-500 bg-red-50 animate-shake ";
                   else btnClass += "border-transparent opacity-40 ";
               } else {
                   if (isSelected) btnClass += "border-rose-500 bg-rose-50 shadow-2xl -translate-y-2 ";
                   else btnClass += "border-gray-100 bg-gray-50 hover:bg-white hover:border-rose-200 hover:shadow-xl ";
               }

               return (
                   <button key={opt.id} onClick={() => handleSelect(opt.id)} className={btnClass}>
                       <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-black text-gray-400 group-hover:border-rose-300 group-hover:text-rose-500 transition-colors">
                           {opt.label}
                       </div>
                       <div className="w-24 h-24 mb-2">
                           <svg viewBox="0 0 100 100" className="w-full h-full">
                               <path d={opt.d} fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="4 2" />
                           </svg>
                       </div>
                       <span className={`text-xs font-black uppercase tracking-tighter ${isSelected ? 'text-rose-600' : 'text-gray-400'}`}>
                           {opt.name}
                       </span>

                       {showResult && showCorrect && (
                           <div className="absolute -bottom-3 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">ĐÚNG</div>
                       )}
                   </button>
               )
           })}
        </div>
      </div>

      {showResult && (
          <div className={`mt-12 px-10 py-4 rounded-full font-black text-lg shadow-xl animate-bounce-short ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isCorrect ? '🎉 Tuyệt vời! Bé quan sát rất giỏi!' : '💡 Bé hãy thử tưởng tượng xoay các mảnh xem sao nhé!'}
          </div>
      )}
    </div>
  );
};

export default ChallengeMath;
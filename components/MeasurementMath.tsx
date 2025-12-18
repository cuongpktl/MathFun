
import React from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const MeasurementMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;
  
  const inputColor = showResult 
      ? (isCorrect ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50') 
      : 'text-gray-800 border-gray-300 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100';

  const renderInput = (unit: string) => (
    <div className="relative inline-flex items-center gap-2">
      <input 
        type="number" 
        inputMode="numeric"
        value={problem.userAnswer || ''}
        onChange={(e) => onUpdate(e.target.value)}
        disabled={showResult}
        className={`w-20 text-center text-2xl font-black p-2 rounded-2xl border-4 outline-none transition-all ${inputColor}`}
        placeholder="?"
      />
      <span className="text-lg font-black text-gray-400">{unit}</span>
      {isWrong && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg z-20 whitespace-nowrap">
          Đúng là: {problem.answer}
        </div>
      )}
    </div>
  );

  // --- 1. Cân đòn (Balance Scale) ---
  if (problem.visualType === 'balance') {
    const weights = Array.isArray(problem.visualData) ? problem.visualData : [];
    return (
      <div className="bg-orange-50 p-6 rounded-[32px] border-4 border-orange-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Con cá nặng bao nhiêu kg?</h3>
        <div className="relative w-full max-w-[280px] h-40 mt-2">
          {/* Trục cân */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[50px] border-b-gray-400"></div>
          {/* Đòn cân */}
          <div className="absolute bottom-[50px] left-0 w-full h-3 bg-gray-600 rounded-full shadow-sm"></div>
          {/* Đĩa bên trái: Cá */}
          <div className="absolute bottom-[53px] left-0 w-32 h-2 bg-gray-400 origin-bottom flex justify-center">
            <div className="absolute bottom-2 flex flex-col items-center">
               <svg width="100" height="60" viewBox="0 0 100 60" className="drop-shadow-lg transform -scale-x-100">
                  <path d="M2 30 L 25 10 L 25 50 Z" fill="#60A5FA" />
                  <path d="M25 30 Q 25 5 60 5 Q 95 5 95 30 Q 95 55 60 55 Q 25 55 25 30 Z" fill="#3B82F6" />
                  <circle cx="80" cy="20" r="4" fill="white" />
                  <path d="M35 25 Q 45 30 35 35 M 45 20 Q 55 30 45 40" stroke="white" strokeWidth="2" fill="none" opacity="0.4"/>
               </svg>
               <div className="w-24 h-2 bg-gray-300 rounded-full mt-1"></div>
            </div>
          </div>
          {/* Đĩa bên phải: Quả cân */}
          <div className="absolute bottom-[53px] right-0 w-32 h-2 bg-gray-400 flex flex-col-reverse items-center justify-start pb-2 gap-1">
            {weights.map((w, idx) => (
              <div key={idx} className="bg-amber-500 text-white text-[10px] font-black w-12 h-10 flex items-center justify-center rounded-lg border-b-4 border-amber-700 shadow-md">
                {w}kg
              </div>
            ))}
            <div className="w-24 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          {renderInput('kg')}
        </div>
      </div>
    );
  }

  // --- 2. Cân đồng hồ (Spring Scale) ---
  if (problem.visualType === 'spring') {
    const weight = typeof problem.visualData === 'number' ? problem.visualData : 0;
    const rotation = weight * 36; // 360 / 10kg
    return (
      <div className="bg-emerald-50 p-6 rounded-[32px] border-4 border-emerald-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Quả dưa hấu nặng bao nhiêu kg?</h3>
        <div className="relative w-48 h-64 flex flex-col items-center">
          {/* Quả dưa hấu */}
          <div className="z-10 w-36 h-28 -mb-4">
            <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
              <ellipse cx="50" cy="40" rx="45" ry="35" fill="#166534" />
              <path d="M15 40 Q 50 50 85 40 M 25 20 Q 50 30 75 20 M 25 60 Q 50 50 75 60" stroke="#4ade80" strokeWidth="4" fill="none" opacity="0.3"/>
              <path d="M50 5 Q 55 -2 60 5" stroke="#3f6212" strokeWidth="4" fill="none" />
            </svg>
          </div>
          {/* Khung cân */}
          <div className="w-32 h-4 bg-gray-300 rounded-full border-2 border-gray-400 shadow-inner"></div>
          <div className="w-6 h-12 bg-gray-400"></div>
          <div className="relative w-40 h-40 bg-emerald-600 rounded-[32px] border-b-8 border-emerald-800 shadow-2xl flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full relative border-4 border-emerald-700 shadow-inner flex items-center justify-center">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div key={n} className="absolute inset-0 flex flex-col items-center pt-1" style={{ transform: `rotate(${n * 36}deg)` }}>
                  <div className="w-1 h-3 bg-gray-300"></div>
                  <span className="text-[10px] font-black text-gray-500 mt-1" style={{ transform: `rotate(-${n * 36}deg)` }}>{n}</span>
                </div>
              ))}
              {/* Kim cân */}
              <div className="absolute top-1/2 left-1/2 w-1 h-14 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full rounded-full transition-transform duration-1000" style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}></div>
              <div className="w-3 h-3 bg-gray-800 rounded-full z-10 shadow-md"></div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          {renderInput('kg')}
        </div>
      </div>
    );
  }

  // --- 3. Bình chia độ (Beaker) ---
  if (problem.visualType === 'beaker') {
    const level = typeof problem.visualData === 'number' ? problem.visualData : 0;
    const heightPerc = (level / 10) * 85;
    return (
      <div className="bg-blue-50 p-6 rounded-[32px] border-4 border-blue-100 flex flex-col items-center shadow-sm animate-fadeIn">
        <h3 className="text-gray-700 font-black mb-6 w-full text-center">Bình nước chứa bao nhiêu Lít (l)?</h3>
        <div className="relative w-36 h-56 bg-white/80 border-[6px] border-gray-300 border-t-0 rounded-b-3xl overflow-hidden shadow-inner flex flex-col-reverse">
          {/* Mực nước */}
          <div className="w-full bg-blue-400/80 transition-all duration-1000 border-t-4 border-blue-500" style={{ height: `${heightPerc}%` }}>
            <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-10"></div>
          </div>
          {/* Vạch chia */}
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => (
              <div key={l} className="absolute right-0 w-full flex items-center justify-end pr-2" style={{ bottom: `${(l/10)*85}%` }}>
                <span className="text-[10px] font-black text-gray-400 mr-2">{l % 2 === 0 ? l : ''}</span>
                <div className={`h-0.5 bg-gray-300 ${l % 2 === 0 ? 'w-8' : 'w-4'}`}></div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          {renderInput('l')}
        </div>
      </div>
    );
  }

  // --- 4. Phép tính đơn vị ---
  return (
    <div className={`p-8 rounded-[32px] border-4 flex flex-col items-center justify-center bg-white shadow-sm transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-pink-100 hover:border-pink-300'}`}>
        <div className="text-3xl font-black text-gray-700 font-mono flex items-center gap-3 flex-wrap justify-center">
            <span>{problem.numbers?.[0]}<span className="text-sm font-sans text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-pink-500">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]}<span className="text-sm font-sans text-gray-400 ml-1">{problem.unit}</span></span>
            <span className="text-gray-300">=</span>
            {renderInput(problem.unit || '')}
        </div>
    </div>
  );
};

export default MeasurementMath;

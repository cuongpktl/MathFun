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
      ? (isCorrect ? 'text-green-600 border-green-200 bg-green-100' : 'text-red-500 border-red-200 bg-red-100') 
      : 'text-gray-800 border-gray-300 bg-white';

  const renderInput = () => (
      <div className="relative inline-block mx-2">
        <input 
            type="number" 
            inputMode="numeric"
            value={problem.userAnswer || ''}
            onChange={(e) => onUpdate(e.target.value)}
            disabled={showResult}
            className={`w-20 text-center text-2xl font-bold p-1 rounded-lg border-2 outline-none focus:ring-2 focus:ring-blue-300 ${inputColor}`}
            placeholder="?"
        />
         {isWrong && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 rounded-full text-xs font-bold shadow-sm whitespace-nowrap z-10">
                {problem.answer}
            </div>
        )}
      </div>
  );

  // --- Visual: Balance Scale ---
  if (problem.visualType === 'balance') {
      const weights: number[] = problem.visualData || [];
      return (
          <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 flex flex-col items-center">
              <h3 className="text-gray-600 font-bold mb-4 w-full text-left">Con cá nặng bao nhiêu kg?</h3>
              <div className="relative w-64 h-32 mt-4">
                  {/* Base */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-gray-400"></div>
                  {/* Beam */}
                  <div className="absolute bottom-[40px] left-0 w-full h-2 bg-gray-600 rounded"></div>
                  {/* Left Plate */}
                  <div className="absolute bottom-[42px] left-0 w-24 h-1 bg-gray-500 origin-bottom animate-[tilt_3s_ease-in-out_infinite]">
                      {/* Fish/Object */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <svg width="80" height="50" viewBox="0 0 100 60" className="drop-shadow-sm">
                                {/* Tail */}
                                <path d="M2 30 L 20 10 L 20 50 Z" fill="#F472B6" />
                                {/* Body */}
                                <path d="M20 30 Q 20 5 60 5 Q 95 5 95 30 Q 95 55 60 55 Q 20 55 20 30 Z" fill="#60A5FA" />
                                {/* Top Fin */}
                                <path d="M45 5 Q 55 -5 65 5" fill="#3B82F6" opacity="0.8" />
                                {/* Bottom Fin */}
                                <path d="M45 55 Q 55 65 65 55" fill="#3B82F6" opacity="0.8" />
                                {/* Side Fin */}
                                <path d="M40 30 Q 55 25 60 35 Q 55 45 40 40 Z" fill="#93C5FD" stroke="#2563EB" strokeWidth="1" />
                                {/* Eye */}
                                <circle cx="80" cy="20" r="5" fill="white" />
                                <circle cx="82" cy="20" r="2" fill="black" />
                                {/* Mouth */}
                                <path d="M90 35 Q 92 38 90 41" stroke="#1E40AF" strokeWidth="2" fill="none" />
                                {/* Scales */}
                                <path d="M30 20 Q 35 25 30 30 M 40 15 Q 45 20 40 25 M 50 15 Q 55 20 50 25" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
                          </svg>
                      </div>
                  </div>
                   {/* Right Plate */}
                  <div className="absolute bottom-[42px] right-0 w-24 h-1 bg-gray-500 flex flex-col-reverse items-center justify-start pb-1 gap-1">
                      {weights.map((w, idx) => (
                          <div key={idx} className="bg-gray-800 text-white text-[10px] font-bold w-10 h-8 flex items-center justify-center rounded border border-gray-600 shadow-sm">
                              {w}kg
                          </div>
                      ))}
                  </div>
              </div>
              <div className="mt-6 text-xl font-bold text-gray-700 flex items-center">
                  Cân nặng: {renderInput()} kg
              </div>
          </div>
      );
  }

  // --- Visual: Spring Scale (Cân đồng hồ) ---
  if (problem.visualType === 'spring') {
      const weight = problem.visualData as number;
      const rotation = weight * (360 / 5); 

      return (
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 flex flex-col items-center">
              <h3 className="text-gray-600 font-bold mb-4 w-full text-left">Quả dưa hấu nặng bao nhiêu kg?</h3>
              <div className="relative w-48 h-56 flex flex-col items-center justify-end">
                  
                  {/* Watermelon */}
                  <div className="absolute bottom-[100px] z-10 w-32 h-24">
                       <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
                           <ellipse cx="50" cy="40" rx="45" ry="35" fill="#166534" />
                           <path d="M20 15 Q 50 25 80 15" stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.6"/>
                           <path d="M10 40 Q 50 50 90 40" stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.6"/>
                           <path d="M20 65 Q 50 55 80 65" stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.6"/>
                           <path d="M50 5 Q 55 0 60 5" stroke="#3f6212" strokeWidth="3" fill="none" />
                       </svg>
                  </div>

                  {/* Weighing Pan */}
                  <div className="absolute bottom-[100px] w-40 h-4 bg-gray-300 rounded-full border border-gray-400"></div>
                  <div className="absolute bottom-[80px] w-4 h-20 bg-gray-400"></div>

                  {/* Scale Body */}
                  <div className="relative w-32 h-32 bg-green-600 rounded-2xl border-4 border-green-700 shadow-lg flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full relative border-2 border-gray-200">
                           {[0, 1, 2, 3, 4].map((num) => {
                               const deg = num * (360 / 5);
                               return (
                                   <div key={num} className="absolute w-full h-full top-0 left-0" style={{ transform: `rotate(${deg}deg)` }}>
                                       <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-gray-400"></div>
                                       <span 
                                         className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600"
                                         style={{ transform: `rotate(-${deg}deg)` }} 
                                       >
                                           {num === 0 ? 5 : num}
                                       </span>
                                   </div>
                               )
                           })}
                           <div 
                                className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full transition-all duration-1000 ease-out"
                                style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
                           ></div>
                           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                  </div>
              </div>
              <div className="mt-4 text-xl font-bold text-gray-700 flex items-center">
                  Cân nặng: {renderInput()} kg
              </div>
          </div>
      )
  }

  // --- Visual: Beaker ---
  if (problem.visualType === 'beaker') {
      const level = problem.visualData as number;
      // Max scale represents 10L, but container has extra space at top.
      // 10L is at 85% height.
      const MAX_SCALE_L = 10;
      const MAX_HEIGHT_PERCENT = 85; 
      
      const heightPerc = (level / MAX_SCALE_L) * MAX_HEIGHT_PERCENT;
      
      return (
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 flex flex-col items-center">
              <h3 className="text-gray-600 font-bold mb-4 w-full text-left">Bình nước chứa bao nhiêu lít?</h3>
              <div className="relative w-32 h-48 border-4 border-gray-400 border-t-0 rounded-b-2xl bg-white overflow-hidden shadow-inner">
                  {/* Ticks and Labels */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => {
                      const bottomPos = (l / MAX_SCALE_L) * MAX_HEIGHT_PERCENT;
                      const isMajor = l % 2 === 0;
                      
                      return (
                        <React.Fragment key={l}>
                            {/* Tick Line */}
                            <div 
                                className={`absolute right-0 border-b ${isMajor ? 'border-gray-500 w-8' : 'border-gray-300 w-4'}`} 
                                style={{ bottom: `${bottomPos}%` }}
                            ></div>
                            {/* Label for major ticks */}
                            {isMajor && (
                                <div 
                                    className="absolute right-9 text-[10px] font-bold text-gray-500" 
                                    style={{ bottom: `calc(${bottomPos}% - 6px)` }}
                                >
                                    {l}l
                                </div>
                            )}
                        </React.Fragment>
                      )
                  })}

                  {/* Liquid */}
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-blue-400 opacity-70 transition-all duration-1000 ease-out border-t border-blue-500"
                    style={{ height: `${heightPerc}%` }}
                  >
                      {/* Reflection/Shine for effect */}
                      <div className="absolute top-0 right-2 w-2 h-full bg-white opacity-20 skew-x-12"></div>
                  </div>
              </div>
              
              <div className="mt-6 text-xl font-bold text-gray-700 flex items-center">
                  Thể tích: {renderInput()} lít (l)
              </div>
          </div>
      )
  }

  // --- Default: Calculation ---
  return (
    <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center bg-white shadow-sm transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-pink-100 hover:border-pink-300'}`}>
        <div className="text-2xl font-bold text-gray-700 font-mono flex items-center gap-2 flex-wrap justify-center">
            <span>{problem.numbers?.[0]} <span className="text-sm text-gray-500 font-sans">{problem.unit}</span></span>
            <span className="text-pink-500">{problem.operators?.[0]}</span>
            <span>{problem.numbers?.[1]} <span className="text-sm text-gray-500 font-sans">{problem.unit}</span></span>
            <span>=</span>
            <div className="relative inline-block">
                {renderInput()}
                <span className="text-sm text-gray-500 font-sans font-bold ml-1">{problem.unit}</span>
            </div>
        </div>
    </div>
  );
};

export default MeasurementMath;
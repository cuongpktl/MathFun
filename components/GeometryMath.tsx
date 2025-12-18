import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const GeometryMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const toggleShape = (id: string) => {
      if (showResult) return;
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      let newSelection;
      if (userSelected.includes(id)) {
          newSelection = userSelected.filter((sid: string) => sid !== id);
      } else {
          newSelection = [...userSelected, id];
      }
      onUpdate(JSON.stringify(newSelection));
  };
  
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // --- Identify Shape Render ---
  if (problem.visualType === 'identify_shape') {
      const visualData = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) ? problem.visualData : {};
      const { targetId = '', shapes = [] } = visualData;
      
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      const targetShapeIds = shapes.filter((s: any) => s.type === targetId).map((s: any) => s.id);
      
      const isIdCorrect = showResult && 
          targetShapeIds.every((id: string) => userSelected.includes(id)) && 
          userSelected.every((id: string) => targetShapeIds.includes(id));
      
      const borderColor = showResult 
          ? (isIdCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
          : 'border-white';

      return (
          <div className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center bg-white shadow-xl transition-all w-full ${borderColor}`}>
              <h3 className="text-xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">
                  {problem.question}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
                  {shapes.map((shape: any) => {
                      const isSelected = userSelected.includes(shape.id);
                      const isTarget = shape.type === targetId;
                      
                      let shapeContainerClass = "relative transition-all duration-300 cursor-pointer p-4 rounded-3xl border-4 flex flex-col items-center justify-center ";
                      if (showResult) {
                          if (isTarget) {
                              shapeContainerClass += isSelected ? "border-green-500 bg-green-50 scale-105 shadow-green-100 " : "border-green-200 bg-white opacity-80 ";
                          } else {
                              shapeContainerClass += isSelected ? "border-red-500 bg-red-50 animate-shake " : "border-transparent opacity-40 ";
                          }
                      } else {
                          if (isSelected) shapeContainerClass += "border-orange-400 bg-orange-50 shadow-2xl shadow-orange-100 -translate-y-2 ";
                          else shapeContainerClass += "border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-lg ";
                      }

                      return (
                          <div key={shape.id} onClick={() => toggleShape(shape.id)} className={shapeContainerClass + "w-32 h-32 sm:w-40 sm:h-40"}>
                              <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible drop-shadow-md">
                                  <path d={shape.d} fill={shape.color} stroke="#334155" strokeWidth="3" />
                                  <text x="50" y="55" textAnchor="middle" className="text-xl font-black fill-gray-800 pointer-events-none select-none" style={{ filter: 'drop-shadow(0px 1px 1px white)' }}>
                                      {shape.num || ''}
                                  </text>
                              </svg>

                              {showResult && isSelected && (
                                  <div className={`absolute -top-3 -right-3 rounded-full p-1.5 shadow-lg ${isTarget ? 'bg-green-500' : 'bg-red-500'}`}>
                                      {isTarget ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                      )}
                                  </div>
                              )}
                          </div>
                      )
                  })}
              </div>
              
              {showResult && (
                  <div className={`mt-10 px-6 py-3 rounded-2xl font-black text-lg ${isIdCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600 animate-bounce-short'}`}>
                      {isIdCorrect ? '🎉 Hoan hô! Bé chọn rất đúng!' : '🔍 Bé hãy nhìn kỹ các cạnh và chọn lại nhé!'}
                  </div>
              )}
          </div>
      )
  }

  // --- Path Length Render ---
  if (problem.visualType === 'path_length') {
      const segments = Array.isArray(problem.visualData) ? problem.visualData : [];
      const points = [];
      let startX = 20;
      let startY = 80;
      points.push({x: startX, y: startY});
      
      segments.forEach((seg: any, idx: number) => {
           const newX = startX + 60;
           const newY = idx % 2 === 0 ? 20 : 80;
           points.push({x: newX, y: newY});
           startX = newX;
      });

      const pathD = points.map((p, i) => (i===0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

      return (
          <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center bg-white shadow-sm transition-all w-full ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-teal-100 hover:border-teal-300'}`}>
               <h3 className="text-gray-700 font-bold mb-2">{problem.question}</h3>
               <div className="w-full max-w-xs overflow-hidden relative h-32 my-2">
                   <svg width="100%" height="100%" viewBox="0 0 240 100" preserveAspectRatio="xMidYMid meet">
                       <path d={pathD} fill="none" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                       {points.map((p, i) => (
                           <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0F766E" />
                       ))}
                       {segments.map((seg: any, i: number) => {
                           const p1 = points[i];
                           const p2 = points[i+1];
                           const mx = (p1.x + p2.x) / 2;
                           const my = (p1.y + p2.y) / 2;
                           return (
                               <text key={i} x={mx} y={my - 10} textAnchor="middle" className="text-xs font-bold fill-gray-600">
                                   {seg.length}cm
                               </text>
                           )
                       })}
                   </svg>
               </div>
               <div className="flex items-center gap-2 mt-4 text-xl font-bold text-gray-700">
                   <span>Đáp án:</span>
                    <div className="relative">
                        <input 
                            type="number" 
                            inputMode="numeric"
                            value={problem.userAnswer || ''}
                            onChange={(e) => onUpdate(e.target.value)}
                            disabled={showResult}
                            className={`w-20 text-center text-2xl font-bold p-1 rounded-lg border-2 outline-none focus:ring-2 focus:ring-teal-300 ${
                                showResult 
                                ? (isCorrect ? 'text-green-600 border-green-200 bg-green-100' : 'text-red-500 border-red-200 bg-red-100') 
                                : 'text-gray-800 border-gray-300 bg-gray-50'
                            }`}
                        />
                         {isWrong && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap z-10">
                                {problem.answer}
                            </div>
                        )}
                    </div>
                    <span>cm</span>
               </div>
          </div>
      )
  }

  return <div>Vui lòng đợi trong giây lát...</div>;
};

export default GeometryMath;
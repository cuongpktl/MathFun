
import React, { useState } from 'react';
import { MathProblem } from '../types';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

const GeometryMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  
  const toggleShape = (id: string) => {
      if (showResult) return;
      let newSelection;
      if (selectedShapeIds.includes(id)) {
          newSelection = selectedShapeIds.filter(sid => sid !== id);
      } else {
          newSelection = [...selectedShapeIds, id];
      }
      setSelectedShapeIds(newSelection);
      onUpdate(JSON.stringify(newSelection));
  };
  
  const isCorrect = showResult && parseInt(problem.userAnswer || '') === problem.answer;
  const isWrong = showResult && !isCorrect;

  // --- Identify Shape Render ---
  if (problem.visualType === 'identify_shape') {
      const { targetId, shapes } = problem.visualData || { targetId: '', shapes: [] };
      const userSelected = problem.userAnswer ? JSON.parse(problem.userAnswer) : [];
      
      const targetShapes = shapes.filter((s: any) => s.type === targetId);
      const targetShapeIds = targetShapes.map((s: any) => s.id);
      
      const isIdCorrect = showResult && 
          targetShapeIds.every((id: string) => userSelected.includes(id)) && 
          userSelected.every((id: string) => targetShapeIds.includes(id));
      
      const borderColor = showResult 
          ? (isIdCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
          : 'border-teal-100 hover:border-teal-300';

      return (
          <div className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center bg-white shadow-sm transition-all w-full ${borderColor}`}>
              <h3 className="text-gray-700 font-bold mb-4">{problem.question}</h3>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                  {shapes.map((shape: any) => {
                      const isSelected = userSelected.includes(shape.id);
                      const isTarget = shape.type === targetId;
                      
                      let shapeClass = "transition-all duration-200 cursor-pointer p-2 rounded-lg border-2 flex items-center justify-center ";
                      if (showResult) {
                          if (isTarget) shapeClass += "border-green-500 bg-green-100 ";
                          else if (isSelected && !isTarget) shapeClass += "border-red-500 bg-red-100 opacity-50 ";
                          else shapeClass += "border-transparent opacity-50 ";
                      } else {
                          if (isSelected) shapeClass += "border-teal-500 bg-teal-50 shadow-md transform scale-105 ";
                          else shapeClass += "border-transparent hover:bg-gray-50 ";
                      }

                      return (
                          <div key={shape.id} onClick={() => toggleShape(shape.id)} className={shapeClass + "w-24 h-24"}>
                              <svg width="80" height="80" viewBox="0 0 100 100" className="overflow-visible">
                                  <path d={shape.d} fill={shape.color} stroke="currentColor" strokeWidth="3" className="text-gray-600" />
                              </svg>
                          </div>
                      )
                  })}
              </div>
              {showResult && !isIdCorrect && (
                   <div className="mt-2 text-red-500 font-bold text-sm">Hãy tìm cho đúng nhé!</div>
              )}
          </div>
      )
  }

  // --- Path Length Render ---
  if (problem.visualType === 'path_length') {
      const segments = problem.visualData || [];
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

  return <div>Unknown Geometry Problem</div>;
};

export default GeometryMath;

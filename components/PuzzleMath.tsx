
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

interface PlacedPiece {
  sourceId: string;
  rotation: number;
}

const PuzzleMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sourceShapes = [], gridPieces = [] } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
    ? problem.visualData 
    : {};
    
  const placedPieces: Record<string, PlacedPiece> = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Theo dõi vị trí chuột/tay khi đang cầm mảnh ghép
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!activeSourceId) return;
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      setMousePos({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [activeSourceId]);

  const handleSourceClick = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (showResult) return;
    audioService.play('click');
    
    if (activeSourceId === id) {
      setActiveSourceId(null);
    } else {
      setActiveSourceId(id);
      setCurrentRotation(0); // Reset rotation khi chọn mảnh mới
      const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
      setMousePos({ x: clientX, y: clientY });
    }
  };

  const rotatePiece = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showResult || !activeSourceId) return;
    audioService.play('click');
    setCurrentRotation(prev => (prev + 90) % 360);
  };

  const handleTargetClick = (targetId: string) => {
    if (showResult) return;
    
    const targetConfig = gridPieces.find((p: any) => p.id === targetId);
    if (!targetConfig) return;

    if (activeSourceId) {
      // KIỂM TRA CHÍNH XÁC: Phải đúng loại hình VÀ đúng góc xoay
      const normCurrentRot = currentRotation % 360;
      const normTargetRot = targetConfig.rot % 360;

      if (activeSourceId === targetConfig.requiredId && normCurrentRot === normTargetRot) {
        audioService.play('correct');
        const newPlaced = { ...placedPieces };
        newPlaced[targetId] = { sourceId: activeSourceId, rotation: currentRotation };
        onUpdate(JSON.stringify(newPlaced));
        setActiveSourceId(null);
      } else {
        audioService.play('wrong');
        // Không khớp thì không đặt vào được
      }
    } else if (placedPieces[targetId]) {
      // Cho phép gỡ ra nếu đang đặt rồi mà nhấn lại
      audioService.play('click');
      const newPlaced = { ...placedPieces };
      delete newPlaced[targetId];
      onUpdate(JSON.stringify(newPlaced));
    }
  };

  const isAllCorrect = showResult && 
    gridPieces.every((p: any) => placedPieces[p.id]?.sourceId === p.requiredId) &&
    Object.keys(placedPieces).length === gridPieces.length;

  return (
    <div ref={containerRef} className="bg-white p-4 sm:p-8 rounded-[40px] border-4 border-sky-100 shadow-2xl flex flex-col items-center w-full max-w-5xl mx-auto relative select-none touch-none">
      
      <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Bé tập xếp hình thông minh</h3>
          <div className="bg-yellow-50 text-yellow-700 px-6 py-2 rounded-full border-2 border-yellow-200 text-sm font-bold flex items-center gap-2 animate-pulse">
            💡 Mẹo: Bé hãy xoay mảnh ghép bên trái cho đúng hướng rồi hãy lắp vào hình bên phải nhé!
          </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
        
        {/* VÙNG BÊN TRÁI: Kho mảnh ghép */}
        <div className="flex flex-row lg:flex-col items-center justify-center bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200 w-full lg:w-48 gap-4 shadow-inner">
          <p className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:block">Mảnh ghép</p>
          {sourceShapes.map((s: any) => {
              const isPicked = activeSourceId === s.id;
              return (
                  <div 
                      key={s.id} 
                      onClick={(e) => handleSourceClick(s.id, e)}
                      className={`group relative p-3 rounded-2xl border-4 transition-all duration-300 cursor-pointer bg-white
                        ${isPicked ? 'border-sky-500 shadow-xl -translate-y-1 scale-110 z-20' : 'border-transparent hover:border-sky-200'}
                      `}
                  >
                      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 overflow-visible drop-shadow-sm">
                          <path 
                            d={s.d} 
                            fill={s.color} 
                            stroke="#334155" 
                            strokeWidth="4" 
                            transform={`rotate(${isPicked ? currentRotation : 0}, 50, 50)`}
                            className="transition-transform duration-200"
                          />
                      </svg>
                      
                      {isPicked && (
                        <button 
                          onClick={rotatePiece}
                          className="absolute -top-3 -right-3 bg-sky-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-sky-700 active:rotate-90 transition-transform"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                      )}
                      
                      <div className="text-[10px] font-black text-gray-400 mt-2 text-center uppercase">{s.name}</div>
                  </div>
              )
          })}
        </div>

        {/* VÙNG BÊN PHẢI: Hình mẫu và target */}
        <div className="relative flex-1 bg-white rounded-[48px] border-8 border-gray-50 p-4 sm:p-8 shadow-xl max-w-[500px]">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
              {/* Bóng mờ gợi ý (Hidden Outlines) */}
              {gridPieces.map((p: any) => (
                <path 
                  key={`hint-${p.id}`}
                  d={p.d} 
                  fill="#f1f5f9" 
                  stroke="#e2e8f0" 
                  strokeWidth="0.5" 
                  strokeDasharray="2 2"
                />
              ))}

              {/* Ô mục tiêu nhận mảnh ghép */}
              {gridPieces.map((p: any) => {
                  const placed = placedPieces[p.id];
                  const shapeData = sourceShapes.find((s:any) => s.id === p.requiredId);
                  const isCorrect = showResult && placed?.sourceId === p.requiredId;

                  return (
                      <g key={p.id} onClick={() => handleTargetClick(p.id)} className="cursor-pointer group">
                          {/* Vùng nhận cảm ứng (Target box) */}
                          <rect 
                            x={p.x - 2} y={p.y - 2} width="10" height="10" 
                            fill="transparent" 
                            className="group-hover:fill-sky-50 transition-colors"
                          />
                          
                          {/* Mảnh đã lắp (nếu có) */}
                          {placed && shapeData && (
                              <g transform={`translate(${p.x}, ${p.y}) scale(${p.scale}) rotate(${placed.rotation}, 50, 50)`}>
                                  <path 
                                      d={shapeData.d} 
                                      fill={shapeData.color} 
                                      stroke={isCorrect ? "#16a34a" : "#1e293b"} 
                                      strokeWidth="4" 
                                      className="drop-shadow-lg"
                                  />
                              </g>
                          )}
                          
                          {/* Điểm nhấn khi đang cầm mảnh đúng loại */}
                          {activeSourceId === p.requiredId && !placed && (
                              <circle cx={p.x + 5} cy={p.y + 5} r="2" fill="#0ea5e9" className="animate-ping" />
                          )}
                      </g>
                  )
              })}
           </svg>
        </div>
      </div>

      {/* MẢNH GHÉP ĐANG CẦM (Theo chuột/tay) */}
      {activeSourceId && (
          <div 
            className="fixed pointer-events-none z-[9999]"
            style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
          >
              <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-2xl opacity-90 transition-transform duration-200" style={{ transform: `rotate(${currentRotation}deg)` }}>
                  <path 
                    d={sourceShapes.find((s:any) => s.id === activeSourceId).d} 
                    fill={sourceShapes.find((s:any) => s.id === activeSourceId).color} 
                    stroke="#0ea5e9" 
                    strokeWidth="8" 
                  />
              </svg>
              <div className="bg-sky-600 text-white text-[10px] font-black px-3 py-1 rounded-full text-center mt-2 shadow-lg">Lắp vào hình nhé!</div>
          </div>
      )}

      {showResult && (
          <div className={`mt-10 p-6 rounded-[32px] font-black text-xl shadow-xl animate-fadeIn w-full text-center ${isAllCorrect ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
              {isAllCorrect ? '🌟 Bé giỏi quá! Hình lắp thật là đẹp!' : '🧐 Bé hãy thử kiểm tra lại các mảnh ghép nhé!'}
          </div>
      )}
    </div>
  );
};

export default PuzzleMath;

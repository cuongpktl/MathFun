
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

interface PlacedPiece {
  sourceInstanceId: string;
  rotation: number;
}

const PuzzleMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sourceShapes = [], gridPieces = [], templateName = '' } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
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

  const handleSourceClick = (instanceId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (showResult) return;
    
    // Nếu đang cầm mảnh này rồi thì thôi, nếu cầm mảnh khác thì đổi
    if (activeSourceId === instanceId) {
      setActiveSourceId(null);
    } else {
      audioService.play('click');
      setActiveSourceId(instanceId);
      setCurrentRotation(0); 
      const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
      setMousePos({ x: clientX, y: clientY });
    }
  };

  const rotatePiece = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (showResult || !activeSourceId) return;
    audioService.play('click');
    setCurrentRotation(prev => (prev + 90) % 360);
  };

  const handleTargetClick = (targetId: string) => {
    if (showResult) return;
    
    const targetConfig = gridPieces.find((p: any) => p.id === targetId);
    if (!targetConfig || !activeSourceId) return;

    const sourceShape = sourceShapes.find((s: any) => s.instanceId === activeSourceId);
    if (!sourceShape) return;

    // KIỂM TRA KHỚP: Đúng loại hình (tri, sq, rect) VÀ đúng góc xoay
    const normCurrentRot = currentRotation % 360;
    const normTargetRot = targetConfig.requiredRot % 360;

    if (sourceShape.id === targetConfig.type && normCurrentRot === normTargetRot) {
      audioService.play('correct');
      const newPlaced = { ...placedPieces };
      newPlaced[targetId] = { sourceInstanceId: activeSourceId, rotation: currentRotation };
      onUpdate(JSON.stringify(newPlaced));
      setActiveSourceId(null); // Đã đặt xong thì bỏ "cầm"
    } else {
      audioService.play('wrong');
      // Thêm gợi ý nhỏ nếu sai góc xoay
      if (sourceShape.id === targetConfig.type && normCurrentRot !== normTargetRot) {
          // Trẻ đã chọn đúng hình nhưng sai hướng
      }
    }
  };

  const handleRemovePiece = (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (showResult) return;
    audioService.play('click');
    const newPlaced = { ...placedPieces };
    delete newPlaced[targetId];
    onUpdate(JSON.stringify(newPlaced));
  };

  const isAllCorrect = showResult && 
    gridPieces.every((p: any) => placedPieces[p.id]?.sourceInstanceId) &&
    Object.keys(placedPieces).length === gridPieces.length;

  return (
    <div ref={containerRef} className="bg-white p-4 sm:p-8 rounded-[48px] border-4 border-sky-100 shadow-2xl flex flex-col items-center w-full max-w-5xl mx-auto relative select-none touch-none overflow-hidden">
      
      <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-tighter">Bé tập xếp hình {templateName}</h3>
          <p className="text-sky-500 font-bold text-sm bg-sky-50 px-6 py-1.5 rounded-full inline-block mb-2">
            {problem.question}
          </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 w-full">
        
        {/* KHO MẢNH GHÉP (BÊN TRÁI) */}
        <div className="flex flex-row lg:flex-col items-center justify-center bg-gray-50 p-6 rounded-[40px] border-2 border-dashed border-gray-200 w-full lg:w-56 gap-4 shadow-inner">
          <p className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:block mb-2">Chọn mảnh ghép</p>
          {sourceShapes.map((s: any) => {
              const isPicked = activeSourceId === s.instanceId;
              const isPlaced = Object.values(placedPieces).some(p => p.sourceInstanceId === s.instanceId);

              return (
                  <div 
                      key={s.instanceId} 
                      onClick={(e) => handleSourceClick(s.instanceId, e)}
                      className={`relative p-3 rounded-3xl border-4 transition-all duration-300 cursor-pointer bg-white group
                        ${isPicked ? 'border-sky-500 shadow-xl -translate-y-2 scale-110 z-20' : 'border-transparent hover:border-sky-200'}
                        ${isPlaced && !isPicked ? 'opacity-20 grayscale pointer-events-none' : ''}
                      `}
                  >
                      <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 overflow-visible drop-shadow-sm">
                          <path 
                            d={s.d} 
                            fill={s.color} 
                            stroke="#334155" 
                            strokeWidth="5" 
                            transform={`rotate(${isPicked ? currentRotation : 0}, 50, 50)`}
                            className="transition-transform duration-200"
                          />
                      </svg>
                      
                      {isPicked && (
                        <button 
                          onClick={rotatePiece}
                          className="absolute -top-4 -right-4 bg-sky-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-sky-700 active:rotate-90 transition-transform"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                      )}
                      
                      <div className="text-[10px] font-black text-gray-400 mt-2 text-center uppercase">{s.name}</div>
                  </div>
              )
          })}
        </div>

        {/* KHUNG TRANH MẪU (BÊN PHẢI) */}
        <div className="relative flex-1 bg-white rounded-[48px] border-8 border-gray-100 p-4 sm:p-10 shadow-xl max-w-[550px] mx-auto w-full aspect-square">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
              {/* Vẽ các ô trống gợi ý (Hidden Outlines) */}
              {gridPieces.map((p: any) => (
                <path 
                  key={`outline-${p.id}`}
                  d={p.d} 
                  fill="#f8fafc" 
                  stroke="#e2e8f0" 
                  strokeWidth="0.8" 
                  strokeDasharray="3 3"
                />
              ))}

              {/* Các ô nhận mảnh ghép */}
              {gridPieces.map((p: any) => {
                  const placed = placedPieces[p.id];
                  const sourceData = placed ? sourceShapes.find((s:any) => s.instanceId === placed.sourceInstanceId) : null;
                  const isCorrect = showResult && placed?.sourceInstanceId;

                  return (
                      <g key={p.id} onClick={() => handleTargetClick(p.id)} className="cursor-pointer group">
                          {/* Vùng cảm ứng rộng để dễ nhấn */}
                          <circle cx={p.x + 5} cy={p.y + 5} r="10" fill="transparent" />
                          
                          {/* Mảnh đã lắp vào khớp */}
                          {placed && sourceData && (
                              <g transform={`translate(${p.x}, ${p.y}) scale(${p.scale}) rotate(${placed.rotation}, 50, 50)`}>
                                  <path 
                                      d={sourceData.d} 
                                      fill={sourceData.color} 
                                      stroke={isCorrect ? "#16a34a" : "#1e293b"} 
                                      strokeWidth="6" 
                                      className="drop-shadow-2xl transition-all duration-500"
                                  />
                              </g>
                          )}
                          
                          {/* Điểm nhấn và nút xóa khi đã lắp */}
                          {placed && !showResult && (
                              <g onClick={(e) => handleRemovePiece(p.id, e as any)}>
                                <circle cx={p.x + 2} cy={p.y + 2} r="4" fill="#ef4444" stroke="white" strokeWidth="1" />
                                <line x1={p.x} y1={p.y} x2={p.x+4} y2={p.y+4} stroke="white" strokeWidth="1.5" />
                                <line x1={p.x+4} y1={p.y} x2={p.x} y2={p.y+4} stroke="white" strokeWidth="1.5" />
                              </g>
                          )}

                          {/* Gợi ý vị trí khi đang cầm mảnh đúng loại hình */}
                          {activeSourceId && !placed && sourceShapes.find((s:any) => s.instanceId === activeSourceId)?.id === p.type && (
                              <circle cx={p.x + 5} cy={p.y + 5} r="3" fill="#0ea5e9" className="animate-ping opacity-60" />
                          )}
                      </g>
                  )
              })}
           </svg>
        </div>
      </div>

      {/* MẢNH GHÉP ĐANG CẦM (BAY THEO TAY/CHUỘT) */}
      {activeSourceId && (
          <div 
            className="fixed pointer-events-none z-[9999] transition-transform duration-75"
            style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
          >
              <div className="relative">
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] opacity-95" 
                    style={{ transform: `rotate(${currentRotation}deg)` }}
                  >
                      <path 
                        d={sourceShapes.find((s:any) => s.instanceId === activeSourceId).d} 
                        fill={sourceShapes.find((s:any) => s.instanceId === activeSourceId).color} 
                        stroke="#0ea5e9" 
                        strokeWidth="10" 
                      />
                  </svg>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-2xl border-2 border-white whitespace-nowrap">
                    Lắp vào khung mẫu nhé!
                  </div>
              </div>
          </div>
      )}

      {showResult && (
          <div className={`mt-10 p-6 rounded-[40px] font-black text-2xl shadow-2xl animate-fadeIn w-full text-center ${isAllCorrect ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
              {isAllCorrect ? (
                <div className="flex items-center justify-center gap-4">
                   <span>🌟 TUYỆT VỜI! BÉ ĐÃ HOÀN THÀNH BỨC TRANH! 🏆</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span>🧐 Bé hãy kiểm tra lại các mảnh ghép nhé!</span>
                  <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Đừng quên xoay đúng hướng như đường mờ gợi ý nha!</span>
                </div>
              )}
          </div>
      )}
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-sky-50 rounded-full -z-10 opacity-50 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-sky-50 rounded-full -z-10 opacity-50 blur-2xl"></div>
    </div>
  );
};

export default PuzzleMath;

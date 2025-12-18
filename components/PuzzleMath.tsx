
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  problem: MathProblem;
  onUpdate: (val: string) => void;
  showResult: boolean;
}

interface PieceState {
  sourceId: string;
  rotation: number;
}

const PuzzleMath: React.FC<Props> = ({ problem, onUpdate, showResult }) => {
  const { sourceShapes = [], gridPieces = [] } = (problem.visualData && typeof problem.visualData === 'object' && !Array.isArray(problem.visualData)) 
    ? problem.visualData 
    : {};
    
  const placedPieces: Record<string, PieceState> = problem.userAnswer ? JSON.parse(problem.userAnswer) : {};
  
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!activeSourceId) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setMousePos({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [activeSourceId]);

  const handleSourceClick = (id: string, e: React.MouseEvent) => {
    if (showResult) return;
    audioService.play('click');
    if (activeSourceId === id) {
      setActiveSourceId(null);
    } else {
      setActiveSourceId(id);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleTargetClick = (targetId: string) => {
    if (showResult) return;
    
    // Nếu đang cầm mảnh trên tay -> lắp vào ô này
    if (activeSourceId) {
      audioService.play('correct');
      const newPlaced = { ...placedPieces };
      
      // Xóa mảnh này khỏi bất kỳ ô nào khác nếu nó đã được đặt
      Object.keys(newPlaced).forEach(key => {
        if (newPlaced[key].sourceId === activeSourceId) delete newPlaced[key];
      });

      newPlaced[targetId] = {
        sourceId: activeSourceId,
        rotation: 0 // Bắt đầu từ 0 độ khi mới lắp vào
      };
      
      onUpdate(JSON.stringify(newPlaced));
      setActiveSourceId(null);
    } else if (placedPieces[targetId]) {
      // Nếu không cầm gì mà nhấn vào ô đã có mảnh -> Xoay mảnh đó (90 độ mỗi lần)
      audioService.play('click');
      const newPlaced = { ...placedPieces };
      newPlaced[targetId].rotation = (newPlaced[targetId].rotation + 90) % 360;
      onUpdate(JSON.stringify(newPlaced));
    }
  };

  const checkPieceCorrect = (targetId: string) => {
    const placed = placedPieces[targetId];
    const correct = problem.answer[targetId];
    if (!placed || !correct) return false;
    return placed.sourceId === correct.sourceId && placed.rotation === correct.rotation;
  };

  const isFullCorrect = showResult && 
    Object.keys(problem.answer).every(targetId => checkPieceCorrect(targetId)) &&
    Object.keys(placedPieces).length === Object.keys(problem.answer).length;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-[40px] border-4 border-sky-100 shadow-2xl flex flex-col items-center w-full max-w-5xl mx-auto relative overflow-hidden select-none">
      
      <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-800 mb-2">Bé Tập Xếp Hình Thông Minh</h3>
          <p className="text-sky-500 font-bold text-sm bg-sky-50 px-4 py-2 rounded-full inline-block">
            {problem.question}
          </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
        
        {/* Phần A: Nguồn mảnh ghép - Đơn giản hơn */}
        <div className="flex flex-row lg:flex-col items-center justify-center bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200 w-full lg:w-48 gap-8">
          {sourceShapes.map((s: any) => {
              const isPicked = activeSourceId === s.id;
              const isPlaced = Object.values(placedPieces).some(p => p.sourceId === s.id);

              return (
                  <div 
                      key={s.id} 
                      onClick={(e) => handleSourceClick(s.id, e)}
                      className={`relative cursor-pointer transition-all duration-300 transform
                          ${isPlaced && !isPicked ? 'opacity-20 grayscale scale-75' : 'hover:scale-110 active:scale-95'}
                          ${isPicked ? 'scale-125 z-20' : ''}
                      `}
                  >
                      <div className={`p-3 rounded-2xl border-4 ${isPicked ? 'border-sky-500 bg-white shadow-xl' : 'border-transparent'}`}>
                          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 overflow-visible drop-shadow-md">
                              <path d={s.d} fill={s.color} stroke="#334155" strokeWidth="4" />
                          </svg>
                      </div>
                      {isPicked && (
                        <div className="absolute -top-2 -right-2 bg-sky-500 text-white p-1 rounded-full animate-bounce">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      )}
                  </div>
              )
          })}
        </div>

        {/* Phần B: Lưới lắp ghép - Có bóng mờ gợi ý */}
        <div className="relative w-full max-w-[400px]">
          <div className="bg-white rounded-[40px] border-8 border-gray-100 overflow-hidden shadow-xl p-4">
             <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* 1. Render các ô trống và bóng mờ gợi ý */}
                {gridPieces.map((piece: any) => {
                    const placed = placedPieces[piece.id];
                    const targetInfo = problem.answer[piece.id];
                    const sourceShape = targetInfo ? sourceShapes.find((s:any) => s.id === targetInfo.sourceId) : null;
                    
                    return (
                        <g key={piece.id} onClick={() => handleTargetClick(piece.id)} className="cursor-pointer group">
                            {/* Nền ô */}
                            <path 
                                d={piece.d} 
                                fill={piece.hintColor || "white"} 
                                fillOpacity={0.15}
                                stroke={activeSourceId ? "#bae6fd" : "#f1f5f9"} 
                                strokeWidth="0.5" 
                            />
                            
                            {/* BÓNG MỜ GỢI Ý (Rất quan trọng cho trẻ lớp 2) */}
                            {sourceShape && !placed && (
                                <path 
                                    d={sourceShape.d} 
                                    fill={sourceShape.color} 
                                    fillOpacity={0.1}
                                    stroke={sourceShape.color}
                                    strokeWidth="1"
                                    strokeDasharray="2 1"
                                    transform={`translate(${piece.id === "5" ? "20,20" : "40,60"}) scale(0.4) rotate(${targetInfo.rotation}, 50, 50)`}
                                    className="pointer-events-none"
                                />
                            )}

                            {/* MẢNH ĐÃ ĐẶT VÀO */}
                            {placed && (
                                <g transform={`translate(${piece.id === "5" ? "20,20" : "40,60"}) scale(0.4)`}>
                                  <g transform={`rotate(${placed.rotation}, 50, 50)`} className="transition-transform duration-300">
                                      <path 
                                          d={sourceShapes.find((s:any) => s.id === placed.sourceId).d} 
                                          fill={sourceShapes.find((s:any) => s.id === placed.sourceId).color} 
                                          stroke="#1e293b" 
                                          strokeWidth="4" 
                                          className={`${checkPieceCorrect(piece.id) ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'drop-shadow-lg'}`}
                                      />
                                  </g>
                                </g>
                            )}
                            
                            {/* Hiệu ứng hào quang khi đúng */}
                            {checkPieceCorrect(piece.id) && (
                                <circle cx={piece.id === "5" ? 40 : 60} cy={piece.id === "5" ? 40 : 80} r="3" fill="#22c55e" className="animate-pulse" />
                            )}
                        </g>
                    )
                })}
             </svg>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-sky-600 font-bold text-sm">
                <div className="w-3 h-3 rounded-full bg-sky-500 animate-ping" />
                <span>Mẹo: Nhấn vào mảnh đã lắp để xoay hình!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mảnh ghép "bay" theo chuột */}
      {activeSourceId && (
          <div 
            className="fixed pointer-events-none z-[9999]"
            style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
          >
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-2xl opacity-90">
                  <path 
                    d={sourceShapes.find((s:any) => s.id === activeSourceId).d} 
                    fill={sourceShapes.find((s:any) => s.id === activeSourceId).color} 
                    stroke="#3b82f6" 
                    strokeWidth="6" 
                  />
              </svg>
          </div>
      )}

      {showResult && (
          <div className={`mt-8 p-6 rounded-[32px] font-black text-xl shadow-xl animate-fadeIn ${isFullCorrect ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
              {isFullCorrect ? '🏆 Bé giỏi quá! Hình đã khớp hoàn toàn!' : '🧐 Bé hãy nhấn vào mảnh ghép để xoay cho đúng bóng mờ nhé!'}
          </div>
      )}
    </div>
  );
};

export default PuzzleMath;

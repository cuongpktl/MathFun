import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { generateMatchingGameData } from '../services/mathUtils';
import { RefreshIcon, StarIcon, BirdIcon, HouseIcon } from './icons';

interface HouseItem {
    id: string;
    value: number;
}

const MatchingGame: React.FC = () => {
  const [birds, setBirds] = useState<MathProblem[]>([]);
  const [houses, setHouses] = useState<HouseItem[]>([]);
  
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState(false);

  const initGame = () => {
    const data = generateMatchingGameData(4);
    setBirds(data.birds);
    setHouses(data.houses);
    setSolvedIds([]);
    setSelectedBirdId(null);
    setSelectedHouseId(null);
    setWrongMatch(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
      if (selectedBirdId && selectedHouseId) {
          if (selectedBirdId === selectedHouseId) {
              setSolvedIds(prev => [...prev, selectedBirdId]);
              setSelectedBirdId(null);
              setSelectedHouseId(null);
          } else {
              setWrongMatch(true);
              const timer = setTimeout(() => {
                  setWrongMatch(false);
                  setSelectedBirdId(null);
                  setSelectedHouseId(null);
              }, 1000);
              return () => clearTimeout(timer);
          }
      }
  }, [selectedBirdId, selectedHouseId]);

  const handleBirdClick = (id: string) => {
      if (solvedIds.includes(id) || wrongMatch) return;
      setSelectedBirdId(selectedBirdId === id ? null : id);
  };

  const handleHouseClick = (id: string) => {
      if (solvedIds.includes(id) || wrongMatch || !selectedBirdId) return;
      setSelectedHouseId(selectedHouseId === id ? null : id);
  };

  const isComplete = birds.length > 0 && solvedIds.length === birds.length;

  return (
    <div className="max-w-4xl mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-gray-800">Ghép Chim Về Tổ</h2>
            <p className="text-gray-500 text-sm">Chọn chú chim rồi chọn ngôi nhà đúng nhé!</p>
        </div>
        <div className="flex items-center gap-3">
            {isComplete && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold animate-bounce text-sm">
                    <StarIcon fill="currentColor" className="w-4 h-4" />
                    <span>Xuất sắc!</span>
                </div>
            )}
            <button onClick={initGame} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="space-y-16 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {birds.map(bird => {
                  const isSolved = solvedIds.includes(bird.id);
                  const isSelected = selectedBirdId === bird.id;
                  const isWrong = wrongMatch && isSelected;

                  return (
                      <div 
                        key={bird.id}
                        onClick={() => handleBirdClick(bird.id)}
                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSolved ? 'scale-0 opacity-0' : 'hover:-translate-y-2'}`}
                      >
                          <div className={`p-2 sm:p-4 rounded-3xl border-4 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center relative shadow-xl bg-white
                              ${isSelected ? 'border-blue-500 bg-blue-50 ring-8 ring-blue-100' : 'border-sky-50'}
                              ${isWrong ? 'border-red-400 bg-red-50 animate-shake' : ''}
                          `}>
                              <BirdIcon className={`w-24 h-24 ${isSelected ? 'text-blue-500' : 'text-sky-400'}`} />
                              <div className="absolute -bottom-5 bg-white border-2 border-sky-100 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-gray-700 shadow-lg whitespace-nowrap">
                                  {bird.numbers?.[0]} {bird.operators?.[0]} {bird.numbers?.[1]} {bird.operators?.[1]} {bird.numbers?.[2]}
                              </div>
                          </div>
                      </div>
                  )
              })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {houses.map(house => {
                  const isSolved = solvedIds.includes(house.id);
                  const isTargetForWrong = wrongMatch && selectedHouseId === house.id;

                  return (
                    <div 
                        key={house.id}
                        onClick={() => handleHouseClick(house.id)}
                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSolved ? 'scale-0 opacity-0' : ''}`}
                      >
                          <div className={`w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-end relative
                               ${isTargetForWrong ? 'animate-shake' : 'hover:scale-105'}
                          `}>
                              <HouseIcon className={`w-full h-full drop-shadow-2xl ${selectedBirdId && !wrongMatch && !isSolved ? 'text-orange-400' : 'text-orange-200'}`} />
                              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl sm:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                  {house.value}
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export default MatchingGame;
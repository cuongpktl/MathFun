import React, { useState, useEffect } from 'react';
import { TabItem, MathProblem } from './types';
import { generateVerticalProblems, generateExpressionProblems, generateFillBlankProblems, generateMeasurementProblems, generateGeometryProblems } from './services/mathUtils';
import VerticalMath from './components/VerticalMath';
import ExpressionMath from './components/ExpressionMath';
import FillBlankMath from './components/FillBlankMath';
import MeasurementMath from './components/MeasurementMath';
import GeometryMath from './components/GeometryMath';
import Find100Game from './components/Find100Game';
import WordProblem from './components/WordProblem';
import MatchingGame from './components/MatchingGame';
import { CalculatorIcon, BookOpenIcon, GridIcon, LayersIcon, CheckCircleIcon, RefreshIcon, PuzzleIcon, ScaleIcon, ShapesIcon } from './components/icons';

const TABS: TabItem[] = [
  { id: 'word', label: 'Bài Toán', icon: <BookOpenIcon />, color: 'bg-yellow-500' },
  { id: 'geometry', label: 'Hình Học', icon: <ShapesIcon />, color: 'bg-teal-500' },
  { id: 'measurement', label: 'Đo Lường', icon: <ScaleIcon />, color: 'bg-pink-500' },
  { id: 'vertical', label: 'Đặt Tính', icon: <LayersIcon />, color: 'bg-blue-500' },
  { id: 'matching', label: 'Ghép Hình', icon: <PuzzleIcon />, color: 'bg-orange-500' },
  { id: 'cards', label: 'Thẻ Số', icon: <GridIcon />, color: 'bg-indigo-500' },
  { id: 'expression', label: 'Biểu Thức', icon: <CalculatorIcon />, color: 'bg-purple-500' },
  { id: 'game', label: 'Tìm 100', icon: <CheckCircleIcon />, color: 'bg-green-500' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('word');
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setShowResult(false);
    if (activeTab === 'vertical') {
      setProblems(generateVerticalProblems(6));
    } else if (activeTab === 'expression') {
      setProblems(generateExpressionProblems(5));
    } else if (activeTab === 'cards') {
        setProblems(generateFillBlankProblems(4));
    } else if (activeTab === 'measurement') {
        setProblems(generateMeasurementProblems(6));
    } else if (activeTab === 'geometry') {
        setProblems(generateGeometryProblems(4));
    } else {
      setProblems([]);
    }
  }, [activeTab]);

  const handleUpdateProblem = (id: string, val: string) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, userAnswer: val } : p));
  };

  const handleRefresh = () => {
    setShowResult(false);
    if (activeTab === 'vertical') setProblems(generateVerticalProblems(6));
    else if (activeTab === 'expression') setProblems(generateExpressionProblems(5));
    else if (activeTab === 'cards') setProblems(generateFillBlankProblems(4));
    else if (activeTab === 'measurement') setProblems(generateMeasurementProblems(6));
    else if (activeTab === 'geometry') setProblems(generateGeometryProblems(4));
  };

  const renderContent = () => {
    if (activeTab === 'word') return <WordProblem />;
    if (activeTab === 'game') return <Find100Game />;
    if (activeTab === 'matching') return <MatchingGame />;

    const isVertical = activeTab === 'vertical';
    const isExpression = activeTab === 'expression';
    
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn px-2 sm:px-0">
        <div className={`grid grid-cols-1 ${isVertical || isExpression ? 'sm:grid-cols-2' : 'sm:grid-cols-2'} gap-4 sm:gap-6`}>
            {problems.map(p => {
                if (activeTab === 'cards') return <FillBlankMath key={p.id} problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />;
                if (activeTab === 'measurement') return <MeasurementMath key={p.id} problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />;
                if (activeTab === 'geometry') return <GeometryMath key={p.id} problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />;
                if (isVertical) return <VerticalMath key={p.id} problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />;
                return (
                    <div key={p.id} className="sm:col-span-2">
                        <ExpressionMath problem={p} onUpdate={(val) => handleUpdateProblem(p.id, val)} showResult={showResult} />
                    </div>
                );
            })}
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 px-4 pb-10">
            <button 
                onClick={handleRefresh}
                className="px-6 py-4 sm:py-3 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                <RefreshIcon />
                Làm Đề Khác
            </button>
            <button 
                onClick={() => setShowResult(!showResult)}
                className={`px-8 py-4 sm:py-3 rounded-2xl font-bold shadow-lg transform transition-all active:scale-95 text-white ${showResult ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {showResult ? 'Làm Lại' : 'Nộp Bài'}
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-baseline">
                <h1 className="text-xl md:text-2xl font-black text-blue-600 uppercase tracking-tighter whitespace-nowrap">
                    Math<span className="text-yellow-500">Fun</span>
                </h1>
                <span className="sm:ml-2 text-[10px] md:text-xs font-black text-gray-500 normal-case italic">
                    Quang Khải - 2A7
                </span>
            </div>
            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                Học kỳ I
            </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar border-t border-gray-50">
            <div className="max-w-5xl mx-auto px-4 flex space-x-2 py-3 min-w-max items-center">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                            activeTab === tab.id 
                            ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-200 transform scale-105` 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
                        }`}
                    >
                        <span className="scale-90">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
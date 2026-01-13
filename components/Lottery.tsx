
import React, { useState, useEffect, useRef } from 'react';
import { Member } from '../types';
import { shuffleArray } from '../utils/helpers';

interface LotteryProps {
  members: Member[];
}

const Lottery: React.FC<LotteryProps> = ({ members }) => {
  const [canRepeat, setCanRepeat] = useState(false);
  const [history, setHistory] = useState<Member[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>(members);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<Member | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailableMembers(members);
    setHistory([]);
    setWinner(null);
  }, [members]);

  const handleStart = () => {
    if (availableMembers.length === 0 && !canRepeat) return;
    
    const pool = canRepeat ? members : availableMembers;
    if (pool.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    
    let speed = 50;
    let count = 0;
    const maxCount = 30 + Math.floor(Math.random() * 20);

    const spin = () => {
      setCurrentIndex(prev => (prev + 1) % pool.length);
      count++;
      
      if (count < maxCount) {
        timerRef.current = window.setTimeout(spin, speed);
        speed += 10; // Ease out
      } else {
        const finalPool = canRepeat ? members : availableMembers;
        const randomIndex = Math.floor(Math.random() * finalPool.length);
        const selected = finalPool[randomIndex];
        
        setWinner(selected);
        setIsSpinning(false);
        setHistory(prev => [selected, ...prev]);
        
        if (!canRepeat) {
          setAvailableMembers(prev => prev.filter(m => m.id !== selected.id));
        }
      }
    };

    spin();
  };

  const resetLottery = () => {
    setAvailableMembers(members);
    setHistory([]);
    setWinner(null);
  };

  const poolToDisplay = canRepeat ? members : availableMembers;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">幸運大抽獎</h2>
        
        <div className="flex justify-center items-center space-x-6 mb-10">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={canRepeat} 
              onChange={() => {
                setCanRepeat(!canRepeat);
                resetLottery();
              }}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <span className="text-slate-600 text-sm font-medium">允許重複中獎</span>
          </label>
          <button 
            onClick={resetLottery}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            重置抽獎
          </button>
        </div>

        <div className="relative h-64 flex items-center justify-center mb-8 bg-gradient-to-b from-slate-50 to-white rounded-3xl border-4 border-dashed border-slate-100 overflow-hidden">
          {winner ? (
            <div className="animate-bounce">
              <div className="text-6xl font-black text-indigo-600 mb-2 drop-shadow-xl">
                {winner.name}
              </div>
              <div className="text-slate-400 font-medium">恭喜獲獎！</div>
            </div>
          ) : isSpinning ? (
            <div className="text-5xl font-bold text-slate-300 transition-all transform scale-110">
              {poolToDisplay[currentIndex]?.name}
            </div>
          ) : (
            <div className="text-slate-300 italic">準備好抽取幸運兒了嗎？</div>
          )}
        </div>

        <button 
          onClick={handleStart}
          disabled={isSpinning || (poolToDisplay.length === 0)}
          className={`px-12 py-4 rounded-full text-xl font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
            isSpinning || poolToDisplay.length === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700'
          }`}
        >
          {isSpinning ? '抽取中...' : '開始抽獎'}
        </button>

        {!canRepeat && (
          <div className="mt-4 text-slate-400 text-sm">
            剩餘人數: {availableMembers.length}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">中獎名單 ({history.length})</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((member, i) => (
              <div key={`${member.id}-${i}`} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                {member.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lottery;

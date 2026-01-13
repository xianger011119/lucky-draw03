
import React, { useState } from 'react';
import { Member, Group } from '../types';
import { shuffleArray, downloadCSV } from '../utils/helpers';
import { COLORS } from '../constants.tsx';

interface GrouperProps {
  members: Member[];
}

const Grouper: React.FC<GrouperProps> = ({ members }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (members.length === 0) return;
    
    // Fix: Explicitly provide Member as generic parameter to ensure shuffled is typed as Member[]
    const shuffled = shuffleArray<Member>(members);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: newGroups.length,
        members: shuffled.slice(i, i + groupSize)
      });
    }
    
    setGroups(newGroups);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">自動分組設定</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-500 mb-2">每組人數</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="2" 
                max={Math.max(2, members.length)} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="w-12 text-center font-bold text-indigo-600 text-lg">{groupSize}</span>
            </div>
          </div>
          
          <div className="flex items-end space-x-2 w-full sm:w-auto">
            <button 
              onClick={generateGroups}
              disabled={members.length === 0}
              className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              重新分組
            </button>
            {groups.length > 0 && (
              <button 
                onClick={() => downloadCSV(groups)}
                className="flex-1 sm:flex-none px-6 py-3 bg-white text-indigo-600 border border-indigo-200 font-bold rounded-xl hover:bg-indigo-50 transition-all"
              >
                下載 CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform hover:-translate-y-1 transition-transform">
              <div className={`px-4 py-2 text-sm font-bold border-b ${COLORS[group.id % COLORS.length]}`}>
                第 {group.id + 1} 組
              </div>
              <div className="p-4 space-y-2">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                      {member.name.charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {groups.length === 0 && members.length > 0 && (
        <div className="py-20 text-center text-slate-400">
          設定每組人數後，點擊「開始分組」查看結果。
        </div>
      )}
    </div>
  );
};

export default Grouper;

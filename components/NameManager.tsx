
import React, { useState, useRef } from 'react';
import { Member } from '../types';
import { parseNames } from '../utils/helpers';
import { MOCK_NAMES } from '../constants.tsx';

interface NameManagerProps {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
}

const NameManager: React.FC<NameManagerProps> = ({ members, onMembersChange }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    onMembersChange(parseNames(text));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      onMembersChange(parseNames(text));
    };
    reader.readAsText(file);
  };

  const loadMockData = () => {
    const mockString = MOCK_NAMES.join('\n');
    setInputText(mockString);
    onMembersChange(parseNames(mockString));
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = members.filter(m => {
      const duplicate = seen.has(m.name);
      seen.add(m.name);
      return !duplicate;
    }).map(m => ({ ...m, isDuplicate: false }));
    
    setInputText(unique.map(m => m.name).join('\n'));
    onMembersChange(unique);
  };

  const hasDuplicates = members.some(m => m.isDuplicate);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">名單來源</h2>
          <div className="flex space-x-2">
            <button 
              onClick={loadMockData}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              模擬名單
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              上傳 CSV
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".csv,.txt" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>
        
        <textarea
          value={inputText}
          onChange={handleManualInput}
          placeholder="貼上姓名名單，每行一個，或是使用逗號分隔..."
          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">名單預覽 ({members.length} 人)</h2>
          {hasDuplicates && (
            <button 
              onClick={removeDuplicates}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-shadow shadow-md hover:shadow-lg text-sm font-medium"
            >
              移除重複姓名
            </button>
          )}
        </div>

        {members.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            目前尚無名單，請先上傳或貼上姓名。
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {members.map((member) => (
              <div 
                key={member.id}
                className={`p-3 rounded-lg border text-sm text-center transition-all ${
                  member.isDuplicate 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium' 
                    : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                {member.name}
                {member.isDuplicate && <span className="ml-1 text-[10px] uppercase font-bold">(重複)</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NameManager;

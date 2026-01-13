
import React, { useState } from 'react';
import { Member, AppTab } from './types';
import NameManager from './components/NameManager';
import Lottery from './components/Lottery';
import Grouper from './components/Grouper';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST_MANAGER);
  const [members, setMembers] = useState<Member[]>([]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600">
              HR Pro Toolkit
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <button 
              onClick={() => setActiveTab(AppTab.LIST_MANAGER)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === AppTab.LIST_MANAGER ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              成員管理
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.LOTTERY)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === AppTab.LOTTERY ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              獎品抽籤
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.GROUPING)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === AppTab.GROUPING ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              自動分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile Navigation */}
        <div className="flex md:hidden bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab(AppTab.LIST_MANAGER)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === AppTab.LIST_MANAGER ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            管理
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.LOTTERY)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === AppTab.LOTTERY ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            抽籤
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.GROUPING)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === AppTab.GROUPING ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            分組
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === AppTab.LIST_MANAGER && (
            <NameManager members={members} onMembersChange={setMembers} />
          )}
          {activeTab === AppTab.LOTTERY && (
            <Lottery members={members} />
          )}
          {activeTab === AppTab.GROUPING && (
            <Grouper members={members} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 HR Pro Toolkit - 您的全方位人力資源輔助工具
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

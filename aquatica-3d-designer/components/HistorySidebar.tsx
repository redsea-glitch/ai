
import React from 'react';
import { ImageHistoryItem } from '../types';

interface HistorySidebarProps {
  history: ImageHistoryItem[];
  onSelect: (item: ImageHistoryItem) => void;
  currentId: string | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, currentId }) => {
  return (
    <div className="glass-card w-full md:w-64 flex-shrink-0 flex flex-col h-full rounded-r-2xl border-l-0 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Design Iterations</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
          <p className="text-slate-500 text-sm italic">No iterations yet...</p>
        )}
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              currentId === item.id ? 'border-cyan-500 scale-105 z-10' : 'border-transparent hover:border-slate-600'
            }`}
          >
            <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <p className="text-[10px] text-white truncate w-full">{item.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;

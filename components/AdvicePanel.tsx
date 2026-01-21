
import React from 'react';

interface AdvicePanelProps {
  advice: string;
  loading: boolean;
}

const AdvicePanel: React.FC<AdvicePanelProps> = ({ advice, loading }) => {
  return (
    <div className="glass-card p-6 rounded-2xl h-full overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Expert Technical Guidance
      </h3>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
          {advice || "Select an area or generate a concept to receive professional 3D implementation advice."}
        </div>
      )}
    </div>
  );
};

export default AdvicePanel;

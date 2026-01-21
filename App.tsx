
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateUnderwaterImage, getTechnicalAdvice } from './services/geminiService';
import { ImageHistoryItem } from './types';
import AdvicePanel from './components/AdvicePanel';
import HistorySidebar from './components/HistorySidebar';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageHistoryItem | null>(null);
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [isApiKeyError, setIsApiKeyError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() && !currentImage) return;

    setLoading(true);
    setIsApiKeyError(false);
    
    try {
      // Use current image as base if it exists for "editing"
      const resultUrl = await generateUnderwaterImage(prompt, currentImage?.url);
      
      if (resultUrl) {
        const newItem: ImageHistoryItem = {
          id: Date.now().toString(),
          url: resultUrl,
          prompt: prompt,
          timestamp: Date.now(),
        };
        setCurrentImage(newItem);
        setHistory(prev => [newItem, ...prev]);
        setPrompt('');
        
        // Fetch advice based on the prompt
        setAdviceLoading(true);
        const newAdvice = await getTechnicalAdvice(prompt);
        setAdvice(newAdvice);
        setAdviceLoading(false);
      }
    } catch (error: any) {
      if (error.message === "API_KEY_ERROR") {
        setIsApiKeyError(true);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newItem: ImageHistoryItem = {
        id: Date.now().toString(),
        url: base64,
        prompt: 'Uploaded Base Image',
        timestamp: Date.now(),
      };
      setCurrentImage(newItem);
      setHistory(prev => [newItem, ...prev]);
      setAdvice("Image uploaded. You can now prompt to edit this environment (e.g., 'Add bioluminescent jellyfish' or 'Increase light shafts').");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="z-10 px-8 py-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Aquatica 3D</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Professional Environment Engine</p>
          </div>
        </div>

        {isApiKeyError && (
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 text-xs rounded-lg animate-bounce">
            API Error: Check project permissions or selection.
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col md:flex-row z-10 overflow-hidden">
        {/* Iterations Sidebar (Desktop) */}
        <div className="hidden md:block">
          <HistorySidebar 
            history={history} 
            onSelect={setCurrentImage} 
            currentId={currentImage?.id || null} 
          />
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-h-0 p-4 md:p-8 gap-6 overflow-y-auto">
          {/* Main Visual Display */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
            <div className="flex-[2] relative group">
              <div className="glass-card w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black flex items-center justify-center relative bg-slate-900/40">
                {currentImage ? (
                  <img 
                    src={currentImage.url} 
                    alt="Current Design" 
                    className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'blur-md opacity-50 scale-105' : 'blur-0 opacity-100 scale-100'}`}
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-slate-400 font-medium">No Scene Active</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Generate a conceptual background or upload an existing asset to begin editing.</p>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                    <p className="text-cyan-400 font-medium tracking-widest text-xs uppercase animate-pulse">Processing Environment...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Advice Sidebar */}
            <div className="flex-1 min-w-[300px]">
              <AdvicePanel advice={advice} loading={adviceLoading} />
            </div>
          </div>

          {/* Persistent Controls - Mobile First Layout */}
          <div className="sticky bottom-0 mt-auto pb-4 pt-2">
             <div className="glass-card p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4">
               <div className="flex items-center gap-2 w-full md:w-auto">
                 <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors border border-slate-700"
                  title="Upload Base Image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
               </div>

               <form onSubmit={handleGenerate} className="flex-1 flex gap-2 w-full">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={currentImage ? "Describe changes (e.g., 'Make water murky and deep', 'Add schools of neon fish')..." : "Describe your underwater vision..."}
                  className="flex-1 bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white placeholder:text-slate-500"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading || (!prompt.trim() && !currentImage)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-cyan-900/40 transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
                >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {currentImage ? 'Edit' : 'Create'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
               </form>
             </div>
          </div>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none animate-drift"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-drift" style={{ animationDelay: '4s' }}></div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PreviewDeck from './components/PreviewDeck';
import { PresentationConfig, PresentationData } from './types';
import { generatePresentationContent } from './services/geminiService';
import { createPptxFile } from './services/pptxService';
import { Presentation } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [currentConfig, setCurrentConfig] = useState<PresentationConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: PresentationConfig) => {
    setIsGenerating(true);
    setError(null);
    setCurrentConfig(config);

    try {
      const data = await generatePresentationContent(config);
      setPresentationData(data);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || "Something went wrong generating the presentation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!presentationData || !currentConfig) return;
    
    try {
      await createPptxFile(presentationData, currentConfig);
    } catch (err) {
      console.error("Error creating file", err);
      alert("Failed to create PPTX file.");
    }
  };

  const handleReset = () => {
    setStep('input');
    setPresentationData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Presentation className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              SlideGen AI
            </h1>
          </div>
          {process.env.API_KEY ? (
             <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
               System Ready
             </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
               API Key Missing
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Views */}
        {step === 'input' ? (
          <>
            <div className="text-center mb-8 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Turn ideas into <br className="hidden md:block"/>
                <span className="text-blue-600">PowerPoints</span> in seconds.
              </h2>
              <p className="text-lg text-slate-600">
                Describe your topic, choose your audience, and let AI structure the slides, write the content, and format the deck for you.
              </p>
            </div>
            <InputForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </>
        ) : (
          presentationData && currentConfig && (
            <PreviewDeck 
              data={presentationData} 
              config={currentConfig}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SlideGen AI. Generated content may differ from real-world facts. Review before presenting.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
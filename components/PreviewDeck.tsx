import React, { useState } from 'react';
import { PresentationData, PresentationConfig, Tone } from '../types';
import Button from './Button';
import { Download, ChevronLeft, ChevronRight, MonitorPlay, FileText, Image as ImageIcon, Quote } from 'lucide-react';

interface PreviewDeckProps {
  data: PresentationData;
  config: PresentationConfig;
  onDownload: () => void;
  onReset: () => void;
}

const PreviewDeck: React.FC<PreviewDeckProps> = ({ data, config, onDownload, onReset }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => {
    if (currentSlideIndex < data.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const currentSlide = data.slides[currentSlideIndex];
  
  // Theme logic for Preview
  const getThemeStyles = (tone: Tone) => {
    switch (tone) {
      case Tone.CREATIVE:
        return "bg-slate-900 text-white border-none";
      case Tone.ACADEMIC:
        return "bg-white text-slate-900 border font-serif";
      case Tone.PERSUASIVE:
         return "bg-white text-slate-900 border font-bold-headings"; // Custom handling via inline styles mainly
      default: // Professional
        return "bg-white text-slate-900 border";
    }
  };

  const themeClass = getThemeStyles(config.tone);
  const accentColor = config.tone === Tone.CREATIVE ? "bg-violet-500" : config.tone === Tone.ACADEMIC ? "bg-red-800" : "bg-blue-600";
  const bulletColor = config.tone === Tone.CREATIVE ? "text-violet-400" : config.tone === Tone.ACADEMIC ? "text-red-800" : "text-blue-500";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">{data.title}</h2>
            <p className="text-slate-500">{data.slides.length} Slides • {config.tone} Tone • {config.audience}</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={onReset} className="!py-2">
                Start Over
            </Button>
            <Button onClick={onDownload} className="!py-2">
                <Download className="w-4 h-4" /> Download .pptx
            </Button>
        </div>
      </div>

      {/* Slide Preview Area */}
      <div className="relative bg-slate-800 rounded-xl p-4 md:p-8 shadow-2xl aspect-video flex flex-col items-center justify-center overflow-hidden group">
        
        {/* Slide Content Container (Simulating 16:9 Slide) */}
        <div className={`w-full h-full rounded shadow-sm flex flex-col overflow-hidden relative ${themeClass}`}>
            
            {/* Header / Title */}
            <div className={`p-6 md:p-8 ${config.tone !== Tone.CREATIVE ? 'border-b border-slate-100' : ''} flex-shrink-0`}>
                <h3 className={`text-2xl md:text-3xl font-bold leading-tight ${config.tone === Tone.CREATIVE ? 'text-violet-100' : 'text-slate-800'}`}>
                    {currentSlide.title}
                </h3>
                <div className={`w-20 h-1 mt-4 rounded-full ${accentColor}`}></div>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 md:p-8 flex gap-6 overflow-y-auto">
                <div className={`flex-1 space-y-4 ${config.includeImages ? 'md:w-3/5' : 'w-full'}`}>
                    <ul className="space-y-4">
                        {currentSlide.bulletPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-lg md:text-xl leading-relaxed opacity-90">
                                <span className={`${bulletColor} mt-1.5 font-bold`}>•</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
                
                {config.includeImages && (
                     <div className="hidden md:block w-2/5 flex-shrink-0">
                        <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden relative shadow-inner">
                            <img 
                                src={`https://image.pollinations.ai/prompt/${encodeURIComponent(currentSlide.imageDescription)}?width=400&height=300&nologo=true`}
                                alt="AI Generated"
                                className="w-full h-full object-cover"
                            />
                        </div>
                     </div>
                )}
            </div>

             {/* Citations Footer */}
             {config.includeCitations && currentSlide.citations && currentSlide.citations.length > 0 && (
                <div className={`px-6 md:px-8 py-2 text-xs italic opacity-60 flex items-center gap-1 ${config.tone === Tone.CREATIVE ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Quote className="w-3 h-3" /> Source: {currentSlide.citations.join('; ')}
                </div>
             )}

            {/* Footer */}
            <div className={`p-4 ${config.tone === Tone.CREATIVE ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400 border-t border-slate-100'} text-sm flex justify-between items-center flex-shrink-0`}>
                <span>SlideGen AI</span>
                <span>{currentSlideIndex + 1} / {data.slides.length}</span>
            </div>
        </div>

        {/* Navigation Controls (Overlay) */}
        <button 
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all disabled:opacity-0"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
            onClick={nextSlide}
            disabled={currentSlideIndex === data.slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all disabled:opacity-0"
        >
            <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Speaker Notes Section */}
      {config.includeSpeakerNotes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-semibold text-amber-800">
                  <MonitorPlay className="w-4 h-4" /> Speaker Notes
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                  {currentSlide.speakerNotes}
              </p>
          </div>
      )}

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2">
        {data.slides.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlideIndex ? `w-8 ${accentColor.replace('bg-', 'bg-')}` : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default PreviewDeck;
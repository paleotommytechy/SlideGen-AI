import React, { useState } from 'react';
import { Audience, Tone, PresentationConfig } from '../types';
import Button from './Button';
import { Wand2, Layout, Users, FileText, Settings2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (config: PresentationConfig) => void;
  isGenerating: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState<Audience>(Audience.PROFESSIONALS);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [slideCount, setSlideCount] = useState(8);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    onSubmit({
      topic,
      audience,
      tone,
      slideCount,
      includeImages,
      includeSpeakerNotes,
      includeCitations,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Layout className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create New Presentation</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-semibold text-slate-700">
              What is your presentation about?
            </label>
            <textarea
              id="topic"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400 resize-none"
              placeholder="e.g. The future of renewable energy in urban environments..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4" /> Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as Audience)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
              >
                {Object.values(Audience).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
              >
                {Object.values(Tone).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Slide Count */}
             <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                 Slide Count: <span className="text-blue-600 font-bold">{slideCount}</span>
              </label>
              <input 
                type="range" 
                min="3" 
                max="20" 
                value={slideCount} 
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>3 slides</span>
                <span>20 slides</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                        type="checkbox"
                        checked={includeImages}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Include AI images</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                        type="checkbox"
                        checked={includeSpeakerNotes}
                        onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Generate speaker notes</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                        type="checkbox"
                        checked={includeCitations}
                        onChange={(e) => setIncludeCitations(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Include Citations</span>
                </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Button 
                type="submit" 
                variant="primary" 
                className="w-full text-lg shadow-xl shadow-blue-500/20"
                isLoading={isGenerating}
            >
              <Wand2 className="w-5 h-5" />
              Generate Presentation
            </Button>
            <p className="text-center text-xs text-slate-400 mt-3">
              Powered by Gemini 3 Flash. Downloads a standard .pptx file.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
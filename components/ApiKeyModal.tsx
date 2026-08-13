import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, Trash2, ExternalLink, ShieldCheck, Sparkles, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputKey.trim();
    onSaveApiKey(trimmed);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Gemini API Key সেটআপ
              </h3>
              <p className="text-xs text-slate-400">
                আপনার নিজস্ব কাস্টম Gemini API Key সেট অথবা রিমুভ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-5 h-5 ${apiKey ? 'text-emerald-400' : 'text-blue-400'}`} />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  {apiKey ? 'কাস্টম এপিআই কি সক্রিয় (Custom Key Active)' : 'সার্ভার ডিফল্ট এপিআই কি সক্রিয় (System Key)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {apiKey ? 'আপনার দেওয়া Gemini API Key ব্যবহার করা হচ্ছে' : 'ফাঁকা রাখলে সিস্টেমের ডিফল্ট কি দিয়ে কাজ চলবে'}
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${apiKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
              {apiKey ? 'Custom' : 'System Default'}
            </span>
          </div>

          {/* Key Input Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Google Gemini API Key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline"
              >
                ফ্রি API Key নিন <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300/90 leading-relaxed space-y-1">
            <p className="font-semibold text-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              কেন নিজস্ব API Key ব্যবহার করবেন?
            </p>
            <p className="text-[11px] text-blue-300/80">
              নিজের Google AI Studio API Key ব্যবহার করলে আপনি শতভাগ প্রাইভেসি, দ্রুত রেসপন্স এবং আনলিমিটেড কোটা সুবিধা পাবেন।
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {inputKey || apiKey ? (
            <button
              onClick={handleClear}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              রিমুভ করুন
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSavedNotice ? <Check className="w-4 h-4 text-slate-950" /> : <Key className="w-3.5 h-3.5" />}
              {isSavedNotice ? 'সেভ হয়েছে!' : 'সেভ করুন'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

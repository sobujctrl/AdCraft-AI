import React from 'react';
import { Sparkles, Bookmark, Zap, FileText, Globe } from 'lucide-react';
import { LanguageType } from '../types';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  language: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  language,
  onLanguageChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AdCraft AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
                Direct Response
              </span>
            </div>
            <p className="text-xs text-slate-400">
              অ্যাড কপি, হুক, পেইন পয়েন্ট ও স্ক্রিপ্ট জেনারেটর (8-Point Ad Bundle)
            </p>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageType)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="auto" className="bg-slate-900 text-white">Auto (অটো)</option>
              <option value="bangla" className="bg-slate-900 text-white">Bangla (বাংলা)</option>
              <option value="english" className="bg-slate-900 text-white">English (ইংরেজি)</option>
              <option value="banglish" className="bg-slate-900 text-white">Banglish (বাংলিশ)</option>
            </select>
          </div>

          {/* Saved Campaigns Button */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all cursor-pointer relative"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span>সংরক্ষিত অ্যাড</span>
            {savedCount > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

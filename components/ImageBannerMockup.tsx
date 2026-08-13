import React, { useState } from 'react';
import { Image, Palette, Download, Sparkles } from 'lucide-react';

interface ImageBannerMockupProps {
  headline: string;
  subline: string;
  tagline?: string;
  productName?: string;
}

export const ImageBannerMockup: React.FC<ImageBannerMockupProps> = ({
  headline,
  subline,
  tagline,
  productName,
}) => {
  const [theme, setTheme] = useState<'dark' | 'gradient' | 'warm' | 'vibrant'>('gradient');

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-slate-700 text-white';
      case 'warm':
        return 'bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900 border-amber-800/60 text-amber-50';
      case 'vibrant':
        return 'bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 border-purple-700 text-white';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border-indigo-800/60 text-white';
    }
  };

  return (
    <div className="space-y-3">
      {/* Theme Switcher Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          ব্যানার ভিউ ডিজাইন (Theme Preview)
        </span>
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          {(['gradient', 'dark', 'warm', 'vibrant'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize cursor-pointer transition-all ${
                theme === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Banner Mockup Canvas */}
      <div
        className={`relative aspect-[1200/630] sm:aspect-[16/9] w-full rounded-2xl border p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${getThemeStyles()}`}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-end relative z-10">
          <span className="text-[10px] text-slate-300 font-medium bg-black/30 px-2.5 py-1 rounded-full border border-white/10">
            ব্যানার সোশ্যাল মিডিয়া ভিজ্যুয়াল
          </span>
        </div>

        {/* Main Banner Headline & Subline */}
        <div className="space-y-3 my-auto py-4 relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-medium max-w-xl leading-relaxed opacity-95">
            {subline}
          </p>
        </div>

        {/* Banner Footer CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10">
          <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
            👉 এখনই বিস্তারিত জানতে স্ক্রোল / ক্লিক করুন
          </span>
          <div className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-lg cursor-pointer">
            ORDER NOW
          </div>
        </div>
      </div>
    </div>
  );
};

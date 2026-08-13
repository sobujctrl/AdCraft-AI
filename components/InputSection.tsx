import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  Sparkles,
  Zap,
  Sliders,
  Layers,
  Globe,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { AdGenerationParams, InputType, LanguageType, ToneType } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';

interface InputSectionProps {
  onGenerate: (params: AdGenerationParams) => void;
  isLoading: boolean;
  selectedLanguage: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onGenerate,
  isLoading,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [inputType, setInputType] = useState<InputType>('text');

  // Form Fields
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [offerOrPrice, setOfferOrPrice] = useState('');

  // Strategy Configs
  const [tone, setTone] = useState<ToneType>('high_converting');
  const [angleStyle, setAngleStyle] = useState('Problem-Agitate-Solve (PAS)');
  const [variationsCount, setVariationsCount] = useState<number>(1);
  const [customInstructions, setCustomInstructions] = useState('');

  // File Upload State
  const [fileData, setFileData] = useState<{
    name: string;
    mimeType: string;
    content: string;
    sizeKb: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Preset Click
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;

    setInputType('text');
    setProductName(preset.productName);
    setProductDescription(preset.productDescription);
    setTargetAudience(preset.targetAudience);
    setProblemSolved(preset.problemSolved);
    setOfferOrPrice(preset.offerOrPrice);
    setTone(preset.tone);
  };

  // Handle File Read
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const sizeKb = Math.round(file.size / 1024);

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFileData({
          name: file.name,
          mimeType: file.type,
          content: reader.result as string,
          sizeKb,
        });
      };
    } else {
      // PDF or Text or JSON/CSV
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFileData({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          content: reader.result as string,
          sizeKb,
        });
      };
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onGenerate({
      inputType,
      productName,
      productDescription,
      targetAudience,
      problemSolved,
      offerOrPrice,
      tone,
      language: selectedLanguage,
      angleStyle,
      fileData: fileData
        ? {
            name: fileData.name,
            mimeType: fileData.mimeType,
            content: fileData.content,
          }
        : undefined,
      customInstructions,
      variationsCount,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-slate-800 max-w-4xl mx-auto">
      {/* Header title & Option A / Option B Selector */}
      <div className="space-y-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600/20" />
            সহজে অ্যাড কপি তৈরি করুন
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ফাইল আপলোড করে অথবা ম্যানুয়ালি তথ্য টাইপ করে অ্যাড কপি তৈরি করুন।
          </p>
        </div>

        {/* Clear Option A vs Option B Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setInputType('document')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              inputType === 'document'
                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${inputType === 'document' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Option (A): ডকুমেন্ট আপলোড</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF, DOCX, TXT বা ক্যাটালগ ফাইল দিয়ে
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              inputType === 'text'
                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${inputType === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Option (B): টাইপ ও টেক্সট আকারে প্রদান</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                প্রোডাক্টের নাম ও বিবরণ লিখে
              </p>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OPTION A: DOCUMENT UPLOAD */}
        {inputType === 'document' && (
          <div className="space-y-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Option (A): আপনার ফাইল বা ক্যাটালগ আপলোড করুন</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-xl p-6 text-center bg-white transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.png,.jpg,.jpeg,.json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                প্রোডাক্ট ব্রোশিয়ার বা ক্যাটালগ ফাইল এখানে ড্রপ বা সিলেক্ট করুন
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, TXT, DOCX, PNG, JPG, JSON, CSV (সর্বোচ্চ 15MB)
              </p>
            </div>

            {/* File Preview Card */}
            {fileData && (
              <div className="flex items-center justify-between p-3 bg-blue-100/70 border border-blue-300 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-blue-900 truncate max-w-xs">
                    {fileData.name} ({fileData.sizeKb} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileData(null)}
                  className="text-slate-500 hover:text-red-600 cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* OPTION B: TEXT FORM FIELDS */}
        {inputType === 'text' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>প্রোডাক্ট / সার্ভিস নাম (Product Name) *</span>
                <span className="text-[10px] text-blue-600 font-normal">যেমন: সুন্দরবনের খাঁটি মধু</span>
              </label>
              <input
                type="text"
                required={inputType === 'text' && !fileData}
                placeholder="আপনার প্রোডাক্টের নাম লিখুন..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>প্রোডাক্ট বিবরণ, সুবিধা ও অফার (Details & Price/Offer)</span>
                <span className="text-[10px] text-slate-400 font-normal">অফার, দাম বা গ্যারান্টি অন্তর্ভুক্ত করুন</span>
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: সুন্দরবনের ১০০% খাঁটি প্রাকৃতিক চাক ভাঙা মধু। দাম ১ কেজি ১২৫০ টাকা + ফ্রি ডেলিভারি..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  কাদের জন্য এটি? (Target Audience - Optional)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পরিবার, তরুণ-তরুণী, শিক্ষার্থী..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  কী সমস্যার সমাধান করে? (Problem Solved - Optional)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বাজারে ভেজাল মধুর ভিড়ে খাঁটি মধু না পাওয়া..."
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* SIMPLE ADVANCED STRATEGY OPTION (Collapsible / Compact) */}
        <details className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs group">
          <summary className="font-bold text-slate-700 cursor-pointer flex items-center justify-between select-none list-none">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              অ্যাডভান্সড অপশন (টোন ও অ্যাঙ্গেল - Optional)
            </span>
            <span className="text-[10px] text-blue-600 font-semibold group-open:hidden">খুলুন ▾</span>
            <span className="text-[10px] text-slate-400 font-semibold hidden group-open:inline">বন্ধ করুন ▴</span>
          </summary>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-2 border-t border-slate-200">
            {/* Tone Selector */}
            <div className="space-y-1">
              <label className="text-slate-600 font-medium text-[11px]">অ্যাডের টোন:</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="high_converting">🚀 High-Converting Direct Sales</option>
                <option value="emotional">❤️ Emotional & Empathetic</option>
                <option value="storytelling">📖 Storytelling Arc</option>
                <option value="controversial">🔥 Pattern Interrupt</option>
                <option value="urgency">⏳ Urgency & Scarcity</option>
                <option value="value_first">💎 Educational & Value</option>
                <option value="humorous">😄 Humorous & Friendly</option>
              </select>
            </div>

            {/* Angle Style */}
            <div className="space-y-1">
              <label className="text-slate-600 font-medium text-[11px]">মার্কেটিং অ্যাঙ্গেল:</label>
              <select
                value={angleStyle}
                onChange={(e) => setAngleStyle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Problem-Agitate-Solve (PAS)">Problem-Agitate-Solve (PAS)</option>
                <option value="Curiosity & Secret Unveiled">Curiosity & Secret</option>
                <option value="Before vs After Transformation">Before vs After</option>
                <option value="Scarcity & Limited Offer">Scarcity & Offer</option>
                <option value="Us vs Competitors (Difference)">Us vs Competitors</option>
              </select>
            </div>

            {/* Variation Count */}
            <div className="space-y-1">
              <label className="text-slate-600 font-medium text-[11px]">ভ্যারিয়েশন সংখ্যা:</label>
              <select
                value={variationsCount}
                onChange={(e) => setVariationsCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={1}>১টি প্রধান কপি (1 Variation)</option>
                <option value={3}>৩টি আলাদা কপি (3 A/B Variations)</option>
              </select>
            </div>
          </div>
        </details>

        {/* SUBMIT GENERATE BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>এআই দিয়ে অ্যাড কপি তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>🚀 সম্পূর্ণ অ্যাড কপি তৈরি করুন (Generate Ad Copy)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

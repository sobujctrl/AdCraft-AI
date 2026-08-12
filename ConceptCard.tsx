import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit2,
  Save,
  Download,
  Sparkles,
  Zap,
  Volume2,
  Film,
  MessageSquare,
  Image as ImageIcon,
  Heart,
  Target,
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { AdConcept } from '../types';
import { ImageBannerMockup } from './ImageBannerMockup';

interface ConceptCardProps {
  concept: AdConcept;
  index: number;
  totalConcepts: number;
  onSave?: (concept: AdConcept) => void;
  isSaved?: boolean;
  productName?: string;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  concept: initialConcept,
  index,
  totalConcepts,
  onSave,
  isSaved = false,
  productName,
}) => {
  const [concept, setConcept] = useState<AdConcept>(initialConcept);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Helper for copying text to clipboard
  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Copy full ad bundle
  const handleCopyFullBundle = () => {
    const fullText = `=== AD CONCEPT: ${concept.angleName} ===
🎯 Target Audience: ${concept.metadata.targetAudienceSummary}

1. IDEA (মূল কনসেপ্ট):
${concept.idea}

2. HOOK (প্রথম ৩ সেকেন্ডের লাইন):
${concept.hook}

3. PAIN POINT (সমস্যা চিহ্নিতকরণ):
${concept.painPoint}

4. SOLUTION (সমাধান):
${concept.solution}

5. CALL TO ACTION (CTA):
${concept.cta}

6. FULL AD SCRIPT (ভিডিও/অডিও স্ক্রিপ্ট):
${concept.fullScript}

7. CAPTION (সোশ্যাল মিডিয়া ক্যাপশন):
${concept.caption}

8. IMAGE AD COPY (ছবি/ব্যানারের টেক্সট):
Headline: ${concept.imageAdCopy.headline}
Subline: ${concept.imageAdCopy.subline}
`;
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Download as TXT / Markdown file
  const handleDownloadTxt = () => {
    const content = `# AD CONCEPT: ${concept.angleName}
Generated on: ${new Date(concept.timestamp).toLocaleString()}

## 1. IDEA (মূল কনসেপ্ট)
${concept.idea}

## 2. HOOK (প্রথম ৩ সেকেন্ডের লাইন)
${concept.hook}

## 3. PAIN POINT (সমস্যা চিহ্নিতকরণ)
${concept.painPoint}

## 4. SOLUTION (সমাধান)
${concept.solution}

## 5. CALL TO ACTION (CTA)
${concept.cta}

## 6. FULL AD SCRIPT
${concept.fullScript}

## 7. CAPTION (সোশ্যাল মিডিয়া ক্যাপশন)
${concept.caption}

## 8. IMAGE AD COPY
Headline: ${concept.imageAdCopy.headline}
Sub-headline: ${concept.imageAdCopy.subline}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AdConcept_${concept.angleName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to copy Ad Concept (Idea, Customer Avatar, Angles, Unique Value)
  const handleCopyAdConcept = () => {
    const text = `=== ১. অ্যাড কনসেপ্ট (Ad Concept) ===
💡 Idea (মূল কনসেপ্ট):
${concept.adConcept?.idea || concept.idea}

👤 Customer Avatar (কাস্টমার অ্যাভাটার):
${concept.adConcept?.customerAvatar || concept.metadata.targetAudienceSummary}

🎯 Angles (মার্কেটিং অ্যাঙ্গেল):
${concept.adConcept?.angles || concept.angleName}

✨ Unique Selling Point (ইউনিক সেল পয়েন্ট):
${concept.adConcept?.uniquePoint || concept.solution}`;

    handleCopy(text, 'adConcept');
  };

  // Helper to copy Ad Script (Hook, Pinpoint Pain, Solution, Call Reaction, Unique Direction)
  const handleCopyAdScript = () => {
    const text = `=== ২. অ্যাড স্ক্রিপ্ট (Ad Script) ===
⚡ Hook (প্রথম ৩ সেকেন্ডের হুক):
"${concept.adScript?.hook || concept.hook}"

💥 Pinpoint Pain (সমস্যা চিহ্নিতকরণ):
${concept.adScript?.pinpointPain || concept.painPoint}

✅ Solution (সমাধান):
${concept.adScript?.solution || concept.solution}

📣 Call Reaction / CTA (কল টু অ্যাকশন):
👉 ${concept.adScript?.callToAction || concept.cta}

🎬 Unique Script & Visual Direction (ইউনিক অডিও-ভিডিও ডিরেকশন):
${concept.adScript?.uniqueDirection || concept.fullScript}`;

    handleCopy(text, 'adScript');
  };

  // Helper to copy Ad Caption (Title, Pinpoint, Brandwise Solution, Unique Offer)
  const handleCopyAdCaption = () => {
    const text = `=== ৩. সোশ্যাল মিডিয়া ক্যাপশন (Ad Caption) ===
📌 Title (ক্যাপশন টাইটেল):
${concept.adCaption?.title || 'বিজ্ঞাপনের বিশেষ অফার!'}

💥 Pinpoint Pain (পেইনপয়েন্ট হাইলাইট):
${concept.adCaption?.pinpoint || concept.painPoint}

🏢 Brandwise Solution (ব্র্যান্ডওয়াইজ সমাধান):
${concept.adCaption?.brandwiseSolution || concept.solution}

👉 Unique Offer & CTA (ইউনিক অফার ও কল টু অ্যাকশন):
${concept.adCaption?.uniqueOffer || concept.cta}`;

    handleCopy(text, 'adCaption');
  };

  // Helper to copy Image Ad Copy & Prompt
  const handleCopyImageAdCopy = () => {
    const text = `=== ৪. ছবির ব্যানার টেক্সট ও ইমেজ প্রম্পট (Image Ad Copy & AI Prompt) ===
🖼️ Image Content (ব্যানারের কন্টেন্ট):
${concept.imageAdCopy?.imgContent || `Headline: ${concept.imageAdCopy.headline}\nSubline: ${concept.imageAdCopy.subline}`}

🎨 Image AI Prompt (ছবি তৈরির ইউনিক এআই প্রম্পট):
${concept.imageAdCopy?.imgPrompt || `Professional commercial photo of product banner, studio lighting, 8k resolution`}`;

    handleCopy(text, 'imageAdCopy');
  };

  // Helper to parse script into Video Visual Direction & Audio Voiceover Script
  const getParsedScripts = () => {
    const rawLines = concept.fullScript.split('\n').map((l) => l.trim()).filter(Boolean);
    const visuals: string[] = [];
    const voiceovers: string[] = [];

    rawLines.forEach((line) => {
      if (/^\[?visual:/i.test(line) || line.toLowerCase().includes('[visual:')) {
        const clean = line.replace(/^\[?visual:\s*/i, '').replace(/\]$/, '').trim();
        visuals.push(`• ${clean}`);
      } else if (/^\[?vo:/i.test(line) || line.toLowerCase().includes('[vo:')) {
        const clean = line.replace(/^\[?vo:\s*/i, '').replace(/\]$/, '').trim();
        voiceovers.push(clean);
      } else if (line.startsWith('Visual:') || line.startsWith('visual:')) {
        visuals.push(`• ${line.replace(/^visual:\s*/i, '').trim()}`);
      } else if (line.startsWith('VO:') || line.startsWith('vo:')) {
        voiceovers.push(line.replace(/^vo:\s*/i, '').trim());
      } else {
        voiceovers.push(line);
      }
    });

    const videoScriptText = visuals.length > 0 
      ? visuals.join('\n') 
      : (concept.metadata.recommendedVisuals?.map((v) => `• ${v}`).join('\n') || concept.fullScript);

    const audioScriptText = voiceovers.length > 0 
      ? voiceovers.join('\n\n') 
      : concept.fullScript;

    return { videoScriptText, audioScriptText };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all mb-8 text-slate-800">
      {/* Header Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
              ভ্যারিয়েশন #{index + 1} / {totalConcepts}
            </span>
            <span className="text-xs font-medium text-slate-500 border-l border-slate-200 pl-2">
              {concept.metadata.languageDetected}
            </span>
            <span className="text-xs font-medium text-blue-600 border-l border-slate-200 pl-2">
              ⏱️ {concept.metadata.estimatedDuration} Script
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600/20" />
            {concept.angleName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            🎯 টার্গেট অডিয়েন্স: <span className="text-slate-700 font-medium">{concept.metadata.targetAudienceSummary}</span>
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isEditing
                ? 'bg-amber-500 text-white font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5 text-slate-500" />}
            {isEditing ? 'সেভ এডিট' : 'এডিট করুন'}
          </button>

          {onSave && (
            <button
              onClick={() => onSave(concept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              {isSaved ? 'সংরক্ষিত' : 'সেভ করুন'}
            </button>
          )}

          <button
            onClick={handleCopyFullBundle}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'সব কপি হয়েছে!' : 'সব তথ্য কপি করুন'}
          </button>

          <button
            onClick={handleDownloadTxt}
            title="Download TXT"
            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="divide-y divide-slate-100 p-6 space-y-6">

        {/* SECTION 1: AD CONCEPT (Idea, Customer Avatar, Angles, Unique Value) */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ১. অ্যাড কনসেপ্ট (Ad Concept)
                </h3>
                <p className="text-[11px] text-slate-500">
                  আইডিয়া, কাস্টমার অ্যাভাটার, পজিশনিং অ্যাঙ্গেল এবং ইউনিক সেল পয়েন্ট (USP)
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyAdConcept}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer font-bold shrink-0 shadow-2xs"
            >
              {copiedSection === 'adConcept' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              {copiedSection === 'adConcept' ? 'কপি হয়েছে!' : 'কনসেপ্ট কপি করুন'}
            </button>
          </div>

          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            {/* 1. Idea */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                ১. মূল আইডিয়া (Idea):
              </span>
              {isEditing ? (
                <textarea
                  value={concept.adConcept?.idea || concept.idea}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      idea: e.target.value,
                      adConcept: { ...(concept.adConcept || {}), idea: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none min-h-[50px]"
                />
              ) : (
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {concept.adConcept?.idea || concept.idea}
                </p>
              )}
            </div>

            {/* 2. Customer Avatar & 3. Angles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Customer Avatar */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5 uppercase">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  ২. কাস্টমার অ্যাভাটার (Customer Avatar):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adConcept?.customerAvatar || concept.metadata.targetAudienceSummary}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        adConcept: { ...(concept.adConcept || {}), customerAvatar: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 leading-relaxed">
                    {concept.adConcept?.customerAvatar || concept.metadata.targetAudienceSummary}
                  </p>
                )}
              </div>

              {/* Angles */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 uppercase">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  ৩. মার্কেটিং অ্যাঙ্গেল (Angles):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adConcept?.angles || concept.angleName}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        angleName: e.target.value,
                        adConcept: { ...(concept.adConcept || {}), angles: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                    {concept.adConcept?.angles || concept.angleName}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Unique Value Proposition */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ৪. ইউনিক সেল পয়েন্ট (Unique Selling Proposition):
              </span>
              {isEditing ? (
                <textarea
                  value={concept.adConcept?.uniquePoint || concept.solution}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      adConcept: { ...(concept.adConcept || {}), uniquePoint: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[50px]"
                />
              ) : (
                <p className="text-xs font-semibold text-emerald-950 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/80 leading-relaxed">
                  ✨ {concept.adConcept?.uniquePoint || concept.solution}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: AD SCRIPT (Hook, Pinpoint Pain, Solution, Call Reaction, Unique Script) */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Film className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ২. অ্যাড স্ক্রিপ্ট (Ad Script)
                </h3>
                <p className="text-[11px] text-slate-500">
                  ৩ সেকেন্ডের হুক, পেইন পয়েন্ট, সমাধান, কল টু রিঅ্যাকশন এবং ইউনিক নির্দেশিকা
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyAdScript}
              className="px-3 py-1.5 text-xs rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-all cursor-pointer font-bold shrink-0 shadow-2xs"
            >
              {copiedSection === 'adScript' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
              {copiedSection === 'adScript' ? 'কপি হয়েছে!' : 'স্ক্রিপ্ট কপি করুন'}
            </button>
          </div>

          <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            {/* 1. Hook */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                ১. ৩ সেকেন্ডের হুক (Hook - Scroll Stopper):
              </span>
              {isEditing ? (
                <textarea
                  value={concept.adScript?.hook || concept.hook}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      hook: e.target.value,
                      adScript: { ...(concept.adScript || {}), hook: e.target.value } as any,
                    })
                  }
                  className="w-full bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs font-bold text-amber-950 focus:outline-none min-h-[50px]"
                />
              ) : (
                <p className="text-xs font-bold text-amber-950 bg-amber-50/90 p-3 rounded-lg border border-amber-200 leading-relaxed">
                  "{concept.adScript?.hook || concept.hook}"
                </p>
              )}
            </div>

            {/* 2. Pinpoint Pain & 3. Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-red-700 flex items-center gap-1.5 uppercase">
                  <Target className="w-3.5 h-3.5 text-red-600" />
                  ২. সমস্যা চিহ্নিতকরণ (Pinpoint Pain):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adScript?.pinpointPain || concept.painPoint}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        painPoint: e.target.value,
                        adScript: { ...(concept.adScript || {}), pinpointPain: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-red-50/50 p-2.5 rounded-lg border border-red-100 leading-relaxed">
                    {concept.adScript?.pinpointPain || concept.painPoint}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ৩. সমাধান (Solution):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adScript?.solution || concept.solution}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        solution: e.target.value,
                        adScript: { ...(concept.adScript || {}), solution: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                    {concept.adScript?.solution || concept.solution}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Call Reaction / CTA */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1.5 uppercase">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                ৪. কল টু অ্যাকশন / রিঅ্যাকশন (Call to Action):
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={concept.adScript?.callToAction || concept.cta}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      cta: e.target.value,
                      adScript: { ...(concept.adScript || {}), callToAction: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-blue-900 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-bold text-blue-900 bg-blue-50/80 p-2.5 rounded-lg border border-blue-100">
                  👉 {concept.adScript?.callToAction || concept.cta}
                </p>
              )}
            </div>

            {/* 5. Unique Script & Visual Direction */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                <Film className="w-3.5 h-3.5 text-indigo-600" />
                ৫. ইউনিক ভিডিও ও অডিও স্ক্রিপ্ট নির্দেশিকা (Unique Script & Visuals):
              </span>
              {isEditing ? (
                <textarea
                  value={concept.adScript?.uniqueDirection || concept.fullScript}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      fullScript: e.target.value,
                      adScript: { ...(concept.adScript || {}), uniqueDirection: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none min-h-[120px]"
                />
              ) : (
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {concept.adScript?.uniqueDirection || concept.fullScript}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: AD CAPTION (Title, Pinpoint Pain, Brandwise Solution, Unique Offer) */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ৩. সোশ্যাল মিডিয়া পোস্ট ক্যাপশন (Ad Caption)
                </h3>
                <p className="text-[11px] text-slate-500">
                  টাইটেল, পেইনপয়েন্ট, ব্র্যান্ডওয়াইজ সমাধান এবং ইউনিক অফার
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyAdCaption}
              className="px-3 py-1.5 text-xs rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 transition-all cursor-pointer font-bold shrink-0 shadow-2xs"
            >
              {copiedSection === 'adCaption' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
              {copiedSection === 'adCaption' ? 'কপি হয়েছে!' : 'ক্যাপশন কপি করুন'}
            </button>
          </div>

          <div className="space-y-3 bg-purple-50/30 p-4 rounded-xl border border-purple-100/80">
            {/* Title */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5 uppercase">
                📌 ১. ক্যাপশন টাইটেল (Headline / Title):
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={concept.adCaption?.title || ''}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      adCaption: { ...(concept.adCaption || {}), title: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-purple-200 rounded-lg p-2 text-xs font-bold text-purple-950 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-bold text-purple-950 bg-white p-2.5 rounded-lg border border-purple-100">
                  🔥 {concept.adCaption?.title || 'বিজ্ঞাপনের আকর্ষণীয় অফার!'}
                </p>
              )}
            </div>

            {/* Pinpoint & Brandwise Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5 uppercase">
                  ❌ ২. পেইনপয়েন্ট হাইলাইট (Pinpoint Pain):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adCaption?.pinpoint || concept.painPoint}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        adCaption: { ...(concept.adCaption || {}), pinpoint: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                    {concept.adCaption?.pinpoint || concept.painPoint}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                  ✅ ৩. ব্র্যান্ডওয়াইজ সমাধান (Brandwise Solution):
                </span>
                {isEditing ? (
                  <textarea
                    value={concept.adCaption?.brandwiseSolution || concept.solution}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        adCaption: { ...(concept.adCaption || {}), brandwiseSolution: e.target.value } as any,
                      })
                    }
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[60px]"
                  />
                ) : (
                  <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-purple-100 leading-relaxed">
                    {concept.adCaption?.brandwiseSolution || concept.solution}
                  </p>
                )}
              </div>
            </div>

            {/* Unique Offer & CTA */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5 uppercase">
                👉 ৪. ইউনিক অফার ও অ্যাকশন (Unique Offer & CTA):
              </span>
              {isEditing ? (
                <textarea
                  value={concept.adCaption?.uniqueOffer || concept.cta}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      adCaption: { ...(concept.adCaption || {}), uniqueOffer: e.target.value } as any,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none min-h-[50px]"
                />
              ) : (
                <p className="text-xs font-semibold text-blue-950 bg-white p-2.5 rounded-lg border border-purple-100">
                  👉 {concept.adCaption?.uniqueOffer || concept.cta}
                </p>
              )}
            </div>

            {/* Full Formatted Caption Box */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                📋 সম্পূর্ণ রেডি-টু-পোস্ট ক্যাপশন:
              </span>
              {isEditing ? (
                <textarea
                  value={concept.caption}
                  onChange={(e) => setConcept({ ...concept, caption: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none min-h-[90px]"
                />
              ) : (
                <div className="p-3 bg-white rounded-lg border border-purple-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {concept.caption}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: IMAGE AD COPY & PROMPT (Image Content & Image AI Prompt) */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <ImageIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ৪. ছবির ব্যানার টেক্সট ও এআই প্রম্পট (Image Ad Copy & AI Prompt)
                </h3>
                <p className="text-[11px] text-slate-500">
                  ছবিতে বসানোর টেক্সট কন্টেন্ট এবং এআই ছবি তৈরির জন্য প্রম্পট
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyImageAdCopy}
              className="px-3 py-1.5 text-xs rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 transition-all cursor-pointer font-bold shrink-0 shadow-2xs"
            >
              {copiedSection === 'imageAdCopy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
              {copiedSection === 'imageAdCopy' ? 'কপি হয়েছে!' : 'প্রম্পট ও ব্যানার কপি করুন'}
            </button>
          </div>

          <div className="space-y-3 bg-amber-50/30 p-4 rounded-xl border border-amber-100/80">
            {/* 1. Image Content (Headline & Subline) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 text-[10px] uppercase block">
                  🖼️ প্রধান হেডলাইন (Image Content):
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={concept.imageAdCopy.headline}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        imageAdCopy: { ...concept.imageAdCopy, headline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-1.5 rounded text-slate-900 font-bold"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-xs">
                    {concept.imageAdCopy.headline}
                  </p>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-blue-900 text-[10px] uppercase block">
                  📌 সাব-লাইন (Subline):
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={concept.imageAdCopy.subline}
                    onChange={(e) =>
                      setConcept({
                        ...concept,
                        imageAdCopy: { ...concept.imageAdCopy, subline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-1.5 rounded text-slate-800"
                  />
                ) : (
                  <p className="text-slate-800 font-medium">
                    {concept.imageAdCopy.subline}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Image AI Prompt (Midjourney / DALL-E / Canva AI prompt) */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-[11px] uppercase flex items-center gap-1.5">
                  🎨 এআই ছবি তৈরির প্রম্পট (Image AI Prompt):
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold uppercase">
                  Midjourney / Canva / DALL-E
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={concept.imageAdCopy.imgPrompt || ''}
                  onChange={(e) =>
                    setConcept({
                      ...concept,
                      imageAdCopy: { ...concept.imageAdCopy, imgPrompt: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded text-xs font-mono text-slate-800 focus:outline-none min-h-[60px]"
                />
              ) : (
                <p className="text-xs font-mono bg-slate-900 text-amber-300 p-3 rounded-lg leading-relaxed select-all">
                  {concept.imageAdCopy.imgPrompt ||
                    `High quality commercial product photo for ${productName || 'product'}, studio lighting, 8k resolution, photorealistic, cinematic composition`}
                </p>
              )}
            </div>

            {/* Banner Preview Mockup */}
            <ImageBannerMockup
              headline={concept.imageAdCopy.headline}
              subline={concept.imageAdCopy.subline}
              productName={productName}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ConceptCard } from './components/ConceptCard';
import { SavedCampaignsDrawer } from "./components/SavedCampaignsDrawer";
import { AdConcept, AdGenerationParams, LanguageType, SavedCampaign } from './types';
import { Sparkles, AlertCircle, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Generated concepts state
  const [concepts, setConcepts] = useState<AdConcept[]>([]);
  const [lastParams, setLastParams] = useState<AdGenerationParams | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Saved campaigns state
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adcraft_saved_campaigns');
      if (stored) {
        setSavedCampaigns(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved campaigns:', e);
    }
  }, []);

  // Save to localStorage
  const persistCampaigns = (updated: SavedCampaign[]) => {
    setSavedCampaigns(updated);
    try {
      localStorage.setItem('adcraft_saved_campaigns', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist saved campaigns:', e);
    }
  };

  // Generate Ad Concepts via Express API Endpoint
  const handleGenerate = async (params: AdGenerationParams) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastParams(params);

    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'অ্যাড কপি জেনারেট করতে সমস্যা হয়েছে।');
      }

      if (data.concepts && data.concepts.length > 0) {
        setConcepts(data.concepts);
        setActiveTab(0);
        // Smooth scroll to output
        setTimeout(() => {
          document.getElementById('ad-output-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        throw new Error('কোনো আউটপুট জেনারেট করা যায়নি। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      console.error('Generate Ad error:', err);
      setErrorMessage(err.message || 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Save Campaign Concept
  const handleSaveConcept = (conceptToSave: AdConcept) => {
    const titleName = lastParams?.productName || conceptToSave.angleName;
    const existingIndex = savedCampaigns.findIndex((c) => c.title === titleName);

    let updated: SavedCampaign[];
    if (existingIndex >= 0) {
      const current = savedCampaigns[existingIndex];
      const alreadyHas = current.concepts.some((c) => c.id === conceptToSave.id);
      if (!alreadyHas) {
        current.concepts.push(conceptToSave);
      }
      updated = [...savedCampaigns];
    } else {
      const newCamp: SavedCampaign = {
        id: `camp-${Date.now()}`,
        title: titleName,
        productName: titleName,
        createdAt: Date.now(),
        concepts: [conceptToSave],
        inputType: lastParams?.inputType || 'text',
        tone: lastParams?.tone || 'high_converting',
        language: selectedLanguage,
      };
      updated = [newCamp, ...savedCampaigns];
    }

    persistCampaigns(updated);
    setSavedSuccessMsg('অ্যাড কনসেপ্ট সফলভাবে সেভ হয়েছে!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Delete Campaign
  const handleDeleteCampaign = (id: string) => {
    const updated = savedCampaigns.filter((c) => c.id !== id);
    persistCampaigns(updated);
  };

  // Select concept from drawer
  const handleSelectFromDrawer = (concept: AdConcept) => {
    setConcepts([concept]);
    setActiveTab(0);
    setTimeout(() => {
      document.getElementById('ad-output-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        savedCount={savedCampaigns.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        language={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Direct Response AI Copywriter & Marketing Strategy Generator
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            আপনার প্রোডাক্টের জন্য <span className="bg-gradient-to-r from-amber-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">হাই-কনভার্টিং অ্যাড কপি</span> তৈরি করুন
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            প্রোডাক্ট ব্রোশিয়ার ডকুমেন্ট আপলোড করুন অথবা সংক্ষেপে লিখে বাটন ক্লিক করুন। এআই আপনাকে দিচ্ছে ৮টি ইউনিক সেকশনে সম্পূর্ণ অ্যাড কনসেপ্ট ও ভিডিও স্ক্রিপ্ট।
          </p>
        </div>

        {/* Saved Success Toast */}
        {savedSuccessMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between max-w-md mx-auto shadow-xl animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {savedSuccessMsg}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-2xl text-xs font-semibold flex items-start gap-3 max-w-2xl mx-auto shadow-xl">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">জেনারেট করতে সমস্যা হয়েছে:</p>
              <p className="font-normal text-rose-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Input Generator Form */}
        <InputSection
          onGenerate={handleGenerate}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />

        {/* OUTPUT DISPLAY SECTION */}
        {concepts.length > 0 && (
          <div id="ad-output-section" className="space-y-6 pt-6 border-t border-slate-800">
            {/* Multi-Variation Tabs (if > 1 variation generated) */}
            {concepts.length > 1 && (
              <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pl-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  A/B Testing Angle Variations:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {concepts.map((concept, idx) => (
                    <button
                      key={concept.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === idx
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Variation #{idx + 1}: {concept.angleName.slice(0, 25)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Active Concept Card */}
            {concepts[activeTab] && (
              <ConceptCard
                key={concepts[activeTab].id}
                concept={concepts[activeTab]}
                index={activeTab}
                totalConcepts={concepts.length}
                onSave={handleSaveConcept}
                isSaved={savedCampaigns.some((c) =>
                  c.concepts.some((sc) => sc.id === concepts[activeTab].id)
                )}
                productName={lastParams?.productName}
              />
            )}

            {/* Quick Regenerate Button */}
            {lastParams && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => handleGenerate({ ...lastParams, variationsCount: lastParams.variationsCount })}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-indigo-500"
                >
                  <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>আরও ১টি নতুন ইউনিক ভ্যারিয়েশন তৈরি করুন (Regenerate New Angle)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AdCraft AI — Direct Response Ad Copywriter. Powered by Gemini 3.6 Flash.</p>
      </footer>

      {/* Saved Campaigns Sidebar Drawer */}
      <SavedCampaignsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        campaigns={savedCampaigns}
        onDeleteCampaign={handleDeleteCampaign}
        onSelectConcept={handleSelectFromDrawer}
      />
    </div>
  );
}

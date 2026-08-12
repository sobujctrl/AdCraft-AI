import React, { useState } from 'react';
import { X, Trash2, Search, Calendar, Copy, Download, ExternalLink, BookmarkCheck } from 'lucide-react';
import { SavedCampaign, AdConcept } from '../../types';
interface SavedCampaignsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: SavedCampaign[];
  onDeleteCampaign: (id: string) => void;
  onSelectConcept: (concept: AdConcept) => void;
}

export const SavedCampaignsDrawer: React.FC<SavedCampaignsDrawerProps> = ({
  isOpen,
  onClose,
  campaigns,
  onDeleteCampaign,
  onSelectConcept,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">সংরক্ষিত অ্যাড ক্যাম্পেইন ({campaigns.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-800 bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              কোনো সংরক্ষিত ক্যাম্পেইন পাওয়া যায়নি।
            </div>
          ) : (
            filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 space-y-2 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-indigo-300">
                      {camp.productName || camp.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(camp.createdAt).toLocaleDateString()} • {camp.concepts.length} Concepts
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteCampaign(camp.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {camp.concepts.map((concept, idx) => (
                    <button
                      key={concept.id}
                      onClick={() => {
                        onSelectConcept(concept);
                        onClose();
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 text-xs text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="truncate max-w-[240px] font-medium text-[11px]">
                        #{idx + 1}: {concept.angleName}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

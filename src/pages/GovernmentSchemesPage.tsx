import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  FileCheck,
  CheckCircle,
  ExternalLink,
  Calendar,
  AlertCircle,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download
} from 'lucide-react';
import { Language, GovernmentScheme } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_GOVERNMENT_SCHEMES } from '../data/mockData';

interface GovernmentSchemesPageProps {
  language: Language;
}

export const GovernmentSchemesPage: React.FC<GovernmentSchemesPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('scheme-2'); // Super seeder open by default

  // Interactive Eligibility Checker State
  const [landAcres, setLandAcres] = useState<number>(4);
  const [hasElectricTubewell, setHasElectricTubewell] = useState<string>('no');
  const [interestedIn, setInterestedIn] = useState<string>('machinery');
  const [checkerResult, setCheckerResult] = useState<string[] | null>(null);

  const categories = [
    'All',
    'Direct Income',
    'Subsidy',
    'Irrigation',
    'Credit',
  ];

  const filteredSchemes = MOCK_GOVERNMENT_SCHEMES.filter((scheme) => {
    const matchesCat = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.punjabiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const runEligibilityCheck = () => {
    const eligible: string[] = ['scheme-1', 'scheme-4']; // PM-Kisan & KCC generally available
    if (landAcres <= 5 || interestedIn === 'machinery') {
      eligible.push('scheme-2'); // CRM Super seeder subsidy
    }
    if (hasElectricTubewell === 'no') {
      eligible.push('scheme-3'); // PM-KUSUM Solar Pump
    }
    eligible.push('scheme-5'); // Micro-irrigation
    setCheckerResult(eligible);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-[#14532D] to-[#0a2f18] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
            <Building2 className="w-3.5 h-3.5" />
            <span>Govt. of Punjab & Ministry of Agriculture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.governmentSchemesTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#EDEDD6] leading-relaxed">
            {t.governmentSchemesSub}
          </p>
        </div>
      </div>

      {/* Interactive Quick Eligibility Checker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-200/80 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#14532D]">
                ਆਪਣੀ ਯੋਗਤਾ ਚੈੱਕ ਕਰੋ (Instant Eligibility Checker)
              </h3>
              <p className="text-xs text-gray-500">
                ਆਪਣੀ ਜ਼ਮੀਨ ਅਤੇ ਲੋੜ ਮੁਤਾਬਕ ਯੋਗ ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ ਲੱਭੋ
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              ਤੁਹਾਡੇ ਕੋਲ ਕਿੰਨੀ ਜ਼ਮੀਨ ਹੈ? (Acres)
            </label>
            <select
              value={landAcres}
              onChange={(e) => setLandAcres(Number(e.target.value))}
              className="w-full bg-gray-50 border rounded-xl p-2.5 font-semibold text-gray-800"
            >
              <option value={2}>ਛੋਟਾ ਕਿਸਾਨ (Small Farmer &lt; 2 Acres)</option>
              <option value={4}>ਦਰਮਿਆਨਾ ਕਿਸਾਨ (2 to 5 Acres)</option>
              <option value={10}>ਵੱਡਾ ਕਿਸਾਨ (More than 5 Acres)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              ਕੀ ਬੋਰਵੈੱਲ 'ਤੇ ਬਿਜਲੀ ਕੁਨੈਕਸ਼ਨ ਹੈ?
            </label>
            <select
              value={hasElectricTubewell}
              onChange={(e) => setHasElectricTubewell(e.target.value)}
              className="w-full bg-gray-50 border rounded-xl p-2.5 font-semibold text-gray-800"
            >
              <option value="no">ਨਹੀਂ (ਡੀਜ਼ਲ ਪੰਪ ਹੈ / ਸੋਲਰ ਪੰਪ ਚਾਹੀਦਾ ਹੈ)</option>
              <option value="yes">ਹਾਂ (PSPCL ਬਿਜਲੀ ਕੁਨੈਕਸ਼ਨ ਹੈ)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1.5">
              ਤੁਹਾਨੂੰ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕੀ ਚਾਹੀਦਾ ਹੈ?
            </label>
            <select
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
              className="w-full bg-gray-50 border rounded-xl p-2.5 font-semibold text-gray-800"
            >
              <option value="machinery">ਸੁਪਰ ਸੀਡਰ / ਟਰੈਕਟਰ ਮਸ਼ੀਨਰੀ ਸਬਸਿਡੀ</option>
              <option value="irrigation">ਸੋਲਰ ਪੰਪ / ਤੁਪਕਾ ਸਿੰਚਾਈ</option>
              <option value="loan">ਸਸਤਾ KCC ਫਸਲੀ ਕਰਜ਼ਾ (4% ਵਿਆਜ)</option>
              <option value="income">ਨਕਦ ਆਮਦਨ ਸਹਾਇਤਾ (PM-KISAN)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={runEligibilityCheck}
          className="px-6 py-3 rounded-2xl bg-[#14532D] text-[#EABF48] font-extrabold text-xs sm:text-sm hover:bg-[#0a2f18] transition-colors cursor-pointer shadow-md"
        >
          ਯੋਗ ਸਕੀਮਾਂ ਦੀ ਜਾਂਚ ਕਰੋ (Check Eligible Schemes)
        </button>

        {checkerResult && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 animate-fadeIn">
            <p className="font-extrabold text-sm mb-1 text-emerald-900">
              ✓ ਮੁਬਾਰਕਾਂ! ਤੁਸੀਂ ਹੇਠ ਲਿਖੀਆਂ {checkerResult.length} ਸਕੀਮਾਂ ਲਈ ਯੋਗ ਹੋ:
            </p>
            <p className="text-gray-600">
              ਹੇਠਾਂ ਦਿੱਤੇ ਕਾਰਡਾਂ ਵਿੱਚੋਂ ਵੇਰਵੇ ਦੇਖੋ ਅਤੇ ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਅਪਲਾਈ ਕਰੋ।
            </p>
          </div>
        )}
      </div>

      {/* Categories & Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#14532D] text-[#EABF48] shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat === 'All' ? 'ਸਾਰੀਆਂ ਸਕੀਮਾਂ (All)' : cat}
          </button>
        ))}
      </div>

      {/* Schemes Accordion List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          const isHighlighted = checkerResult && checkerResult.includes(scheme.id);

          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-3xl overflow-hidden shadow-md border transition-all ${
                isHighlighted ? 'border-[#4D9B55] ring-2 ring-emerald-300/50' : 'border-gray-200/80'
              }`}
            >
              {/* Header / Click to Expand */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4 select-none hover:bg-gray-50/70"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14532D]/10 text-[#14532D]">
                      {scheme.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {scheme.status}
                    </span>
                    {isHighlighted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EABF48] text-[#14532D]">
                        ਤੁਸੀਂ ਯੋਗ ਹੋ (Eligible)
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#14532D]">
                    {scheme.punjabiTitle}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{scheme.shortDesc}</p>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-gray-500 block">ਸਬਸਿਡੀ ਲਾਭ</span>
                    <strong className="text-xs font-black text-emerald-700">{scheme.subsidyAmount}</strong>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 sm:px-6 pb-6 pt-2 border-t border-gray-100 space-y-5 text-xs text-gray-700"
                  >
                    {/* Benefits Highlight */}
                    <div className="p-4 rounded-2xl bg-[#F7F7E9] border border-[#14532D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">ਲਾਭ (Benefits):</span>
                        <strong className="text-sm text-[#14532D]">{scheme.benefits}</strong>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">ਮਿਆਦ / ਡੈੱਡਲਾਈਨ:</span>
                        <span className="text-xs font-semibold text-gray-800">{scheme.deadlines}</span>
                      </div>
                    </div>

                    {/* Eligibility & Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Eligibility */}
                      <div className="bg-gray-50 p-4 rounded-2xl border space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#14532D] flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>ਕੌਣ ਅਪਲਾਈ ਕਰ ਸਕਦਾ ਹੈ? (Eligibility)</span>
                        </h4>
                        <ul className="space-y-1.5 text-gray-600">
                          {scheme.eligibility.map((e, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documents Required */}
                      <div className="bg-gray-50 p-4 rounded-2xl border space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#14532D] flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-blue-600" />
                          <span>ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ (Documents Required)</span>
                        </h4>
                        <ul className="space-y-1.5 text-gray-600">
                          {scheme.documentsRequired.map((d, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Application Steps */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#14532D]">
                        ਅਪਲਾਈ ਕਰਨ ਦਾ ਤਰੀਕਾ (Step-by-Step Application Process):
                      </h4>
                      <ol className="list-decimal list-inside space-y-1.5 pl-1 text-gray-700">
                        {scheme.applicationProcess.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Direct Portal Link */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-500">
                        ਸਰਕਾਰੀ ਪੋਰਟਲ 'ਤੇ ਨਿਰਵਿਘਨ ਸੇਵਾ ਉਪਲਬਧ ਹੈ।
                      </span>

                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#14532D] text-[#EABF48] font-bold text-xs hover:bg-[#0a2f18] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>ਸਰਕਾਰੀ ਪੋਰਟਲ 'ਤੇ ਅਪਲਾਈ ਕਰੋ</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

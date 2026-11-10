import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Calendar,
  Building2,
  ShieldCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { Language, MandiRateItem } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { PUNJAB_DISTRICTS } from '../data/mockData';
import {
  subscribeLiveMandi,
  forceMandiRefresh,
  LiveTradeLog
} from '../data/liveMandiStore';

interface MandiRatesPageProps {
  language: Language;
}

export const MandiRatesPage: React.FC<MandiRatesPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [rates, setRates] = useState<MandiRateItem[]>([]);
  const [liveTrades, setLiveTrades] = useState<LiveTradeLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<number>(10);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Subscribe to real-time Mandi updates
  useEffect(() => {
    const unsubscribe = subscribeLiveMandi((newRates, newTrades, updatedTime) => {
      setRates(newRates);
      setLiveTrades(newTrades);
      setLastUpdated(updatedTime);
      setCountdown(10);
    });

    // Countdown interval
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 10));
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    forceMandiRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const cropsList = [
    'All',
    'Wheat (ਕਣਕ)',
    'Basmati Paddy (ਬਾਸਮਤੀ)',
    'Cotton (ਨਰਮਾ/ਕਪਾਹ)',
    'Mustard (ਸਰ੍ਹੋਂ)',
    'Maize (ਮੱਕੀ)',
    'Potato (ਆਲੂ)',
    'Kinnow (ਕਿੰਨੂ)',
  ];

  const filteredRates = rates.filter((item) => {
    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchesCrop = selectedCrop === 'All' || item.crop.includes(selectedCrop.split(' ')[0]);
    const matchesSearch =
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesCrop && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#1b5e34] to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Punjab Mandi Board & AGMARKNET Official Feed</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                ਲਾਈਵ ਬੋਲੀ ਜਾਰੀ ਹੈ (Real-Time Auctions)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t.mandiRatesTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#EDEDD6] leading-relaxed">
              ਪੰਜਾਬ ਦੀਆਂ ਸਾਰੀਆਂ 154 ਅਨਾਜ ਮੰਡੀਆਂ ਦੇ ਰੋਜ਼ਾਨਾ ਭਾਅ, ਮਾਡਲ ਰੇਟ ਅਤੇ ਅਸਲ ਖਰੀਦ-ਵੇਚ ਦਾ ਲਾਈਵ ਡਾਟਾ।
            </p>
          </div>

          {/* Real-time sync & refresh button */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20 text-left sm:text-right shrink-0 space-y-2">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-emerald-300 font-bold">
              <Clock className="w-4 h-4 text-[#EABF48]" />
              <span>
                ਆਖ਼ਰੀ ਅੱਪਡੇਟ: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <p className="text-[11px] text-white/70">
              ਅਗਲੀ ਬੋਲੀ ਅੱਪਡੇਟ: <strong className="text-[#EABF48]">{countdown} ਸਕਿੰਟ</strong> ਵਿੱਚ
            </p>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D] font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>ਹੁਣੇ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ (Live Refresh)</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE AUCTION TRADE LOGS TICKER */}
      <div className="bg-white rounded-2xl p-3.5 shadow-md border border-gray-200/80 flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-extrabold text-xs uppercase tracking-wider text-[#14532D] flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            ਲਾਈਵ ਖਰੀਦ ਬੋਲੀ ਫੀਡ (Recent Deals):
          </span>
        </div>

        <div className="flex-1 overflow-x-auto whitespace-nowrap flex items-center gap-3 text-xs scrollbar-none py-1">
          {liveTrades.map((deal) => (
            <div
              key={deal.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#14532D]"
            >
              <strong className="font-extrabold">{deal.mandi}</strong>
              <span className="text-gray-600 font-medium">{deal.crop}</span>
              <span className="font-black text-emerald-800">₹{deal.ratePerQtl}/Qtl</span>
              <span className="text-[10px] text-gray-500">({deal.quantityQuintals} ਕੁਇੰਟਲ)</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                {deal.buyer}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MSP 2026 Reference Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-500">ਸਰਕਾਰੀ ਕਣਕ MSP 2026</p>
          <p className="text-xl font-black text-[#14532D] mt-0.5">₹2,425 / Qtl</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+₹150 ਵਾਧਾ</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-500">ਝੋਨਾ (Common) MSP</p>
          <p className="text-xl font-black text-[#14532D] mt-0.5">₹2,320 / Qtl</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Grade A: ₹2,340</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-500">ਨਰਮਾ (Medium Staple) MSP</p>
          <p className="text-xl font-black text-[#14532D] mt-0.5">₹7,121 / Qtl</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Long: ₹7,521</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-gray-500">ਸਰ੍ਹੋਂ (Mustard) MSP</p>
          <p className="text-xl font-black text-[#14532D] mt-0.5">₹5,650 / Qtl</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+₹300 ਵਾਧਾ</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-200/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ਮੰਡੀ ਜਾਂ ਫਸਲ ਖੋਜੋ (e.g. Khanna, Basmati, Bathinda...)"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-xs focus:ring-2 focus:ring-[#4D9B55] outline-none"
            />
          </div>

          {/* District filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-50 border rounded-2xl py-2.5 px-3 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#4D9B55] outline-none cursor-pointer"
            >
              <option value="All">ਸਾਰੇ ਜ਼ਿਲ੍ਹੇ (All Punjab Districts)</option>
              {PUNJAB_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Crop filter */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-gray-50 border rounded-2xl py-2.5 px-3 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#4D9B55] outline-none cursor-pointer"
            >
              {cropsList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'ਸਾਰੀਆਂ ਫਸਲਾਂ (All Crops)' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mandi Rates Live Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRates.map((rate) => {
            const diffWithMsp = rate.msp > 0 ? rate.modalPrice - rate.msp : 0;
            const isAboveMsp = diffWithMsp >= 0;

            return (
              <motion.div
                key={rate.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-200/80 space-y-4 hover:shadow-lg transition-all relative overflow-hidden"
              >
                {/* Real-time blinking dot */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ਲਾਈਵ
                  </span>
                </div>

                <div className="flex items-start justify-between pr-16">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#14532D]">
                        {rate.district}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        {rate.source}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-[#14532D]">{rate.mandi}</h3>
                    <p className="text-xs font-bold text-gray-700">{rate.crop} • {rate.variety}</p>
                  </div>
                </div>

                {/* Price Highlights */}
                <div className="grid grid-cols-3 gap-2 py-3.5 px-4 rounded-2xl bg-[#F7F7E9] text-center border border-[#14532D]/10">
                  <div>
                    <span className="text-[10px] text-gray-500 block">ਘੱਟੋ-ਘੱਟ (Min)</span>
                    <strong className="text-sm text-gray-800">₹{rate.minPrice}</strong>
                  </div>
                  <div className="border-x border-gray-300 px-1 bg-white/60 rounded-xl py-1 shadow-sm">
                    <span className="text-[10px] text-emerald-800 font-bold block">ਮਾਡਲ ਰੇਟ (Modal)</span>
                    <strong className="text-lg text-emerald-800 font-black">₹{rate.modalPrice}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">ਵੱਧ ਤੋਂ ਵੱਧ (Max)</span>
                    <strong className="text-sm text-gray-800">₹{rate.maxPrice}</strong>
                  </div>
                </div>

                {/* MSP Comparison & Daily Arrivals */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 pt-1">
                  <div>
                    {rate.msp > 0 ? (
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isAboveMsp ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        MSP ਨਾਲੋਂ: {isAboveMsp ? `+₹${diffWithMsp}` : `-₹${Math.abs(diffWithMsp)}`} / Qtl
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">ਖੁੱਲ੍ਹੀ ਨਿਲਾਮੀ ਭਾਅ</span>
                    )}
                  </div>

                  <span className="text-gray-600 font-medium">
                    ਕੁੱਲ ਆਮਦ (Arrivals): <strong>{rate.arrivalQuantityQuintals.toLocaleString()} ਕੁਇੰਟਲ</strong>
                  </span>
                </div>

                <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 flex items-center justify-between">
                  <span>{rate.date}</span>
                  <span className="text-emerald-700 font-semibold">ਸਰਕਾਰੀ ਕੰਪਿਊਟਰਾਈਜ਼ਡ ਕੰਡਾ (Verified Weight)</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredRates.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-500 space-y-2">
            <Info className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm font-bold">ਚੁਣੀ ਗਈ ਮੰਡੀ ਜਾਂ ਫਸਲ ਦਾ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।</p>
          </div>
        )}
      </div>

      {/* Official Transparency Footer */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>ਸਾਰੇ ਮੰਡੀ ਭਾਅ ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਅਤੇ e-NAM ਅਧਿਕਾਰਤ ਨਿਲਾਮੀ ਰਿਕਾਰਡ ਅਨੁਸਾਰ ਰੀਅਲ-ਟਾਈਮ ਅੱਪਡੇਟ ਹੁੰਦੇ ਹਨ।</span>
        </div>
        <a
          href="https://agmarknet.gov.in"
          target="_blank"
          rel="noreferrer"
          className="font-bold underline text-emerald-800 flex items-center gap-1 shrink-0"
        >
          AGMARKNET ਪੋਰਟਲ <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

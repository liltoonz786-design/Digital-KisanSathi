import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mic,
  Stethoscope,
  TrendingUp,
  Tag,
  Calculator,
  Building2,
  Tractor,
  CloudSun,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Wind,
  Radio,
  Video
} from 'lucide-react';
import { Language, MandiRateItem } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  MOCK_WEATHER_DATA,
  MOCK_PRODUCTS,
  PUNJAB_DISTRICTS,
  MOCK_SAMPLE_CROP_DISEASES
} from '../data/mockData';
import { subscribeLiveMandi } from '../data/liveMandiStore';

interface HomePageProps {
  language: Language;
  setCurrentTab: (tab: string) => void;
  openVoiceAssistant: () => void;
  openVideoAssistant?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  setCurrentTab,
  openVoiceAssistant,
  openVideoAssistant,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ludhiana');
  const [liveRates, setLiveRates] = useState<MandiRateItem[]>([]);

  useEffect(() => {
    const unsub = subscribeLiveMandi((rates) => {
      setLiveRates(rates);
    });
    return () => unsub();
  }, []);

  const currentWeather = MOCK_WEATHER_DATA[selectedDistrict] || MOCK_WEATHER_DATA['Ludhiana'];

  const coreFeatures = [
    {
      id: 'crop-doctor',
      title: language === 'punjabi' ? 'ਏ.ਆਈ. ਫਸਲ ਡਾਕਟਰ' : language === 'hindi' ? 'ए.आई. फसल डॉक्टर' : 'AI Crop Doctor',
      sub: language === 'punjabi' ? 'ਫੋਟੋ ਖਿੱਚੋ, ਬਿਮਾਰੀ ਪਛਾਣੋ ਅਤੇ PAU ਇਲਾਜ ਪਾਓ' : 'Snap photo, detect disease & get safe dosage',
      icon: Stethoscope,
      color: 'from-emerald-700 to-emerald-900',
      badge: 'Gemini 3.8 Vision',
    },
    {
      id: 'price-checker',
      title: language === 'punjabi' ? 'ਐਗਰੀ ਪ੍ਰੋਡਕਟ ਭਾਅ ਚੈੱਕਰ' : language === 'hindi' ? 'कृषि उत्पाद रेट चेकर' : 'Product Price Checker',
      sub: language === 'punjabi' ? 'ਖਾਦ, ਦਵਾਈ, ਬੀਜ ਦੇ MRP ਅਤੇ ਵੈਰੀਫਾਈਡ ਰੇਟ' : 'Check MRP & verified dealer prices, report overcharging',
      icon: Tag,
      color: 'from-amber-600 to-amber-800',
      badge: 'Anti-Blackmarketing',
    },
    {
      id: 'mandi',
      title: language === 'punjabi' ? 'ਪੰਜਾਬ ਮੰਡੀ ਭਾਅ' : language === 'hindi' ? 'पंजाब मंडी भाव' : 'Punjab Mandi Rates',
      sub: language === 'punjabi' ? 'ਖੰਨਾ, ਬਠਿੰਡਾ ਮੰਡੀ ਦੇ ਲਾਈਵ ਭਾਅ ਤੇ MSP' : 'Asia’s biggest grain market rates & MSP comparison',
      icon: TrendingUp,
      color: 'from-green-700 to-green-900',
      badge: 'Punjab Mandi Board',
    },
    {
      id: 'calculators',
      title: language === 'punjabi' ? 'ਖੇਤੀ ਮੁਨਾਫ਼ਾ ਕੈਲਕੁਲੇਟਰ' : language === 'hindi' ? 'कृषि मुनाफा कैलकुलेटर' : 'Farming Calculators',
      sub: language === 'punjabi' ? 'ਕਣਕ ਤੇ ਝੋਨੇ ਦਾ ਪ੍ਰਤੀ ਏਕੜ ਖਰਚਾ ਤੇ ਬੱਚਤ' : 'Acreage investment, yield & profit/loss analyzer',
      icon: Calculator,
      color: 'from-teal-700 to-teal-900',
      badge: '5 Crops',
    },
    {
      id: 'schemes',
      title: language === 'punjabi' ? 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਤੇ ਸਬਸਿਡੀ' : language === 'hindi' ? 'सरकारी योजनाएं व सब्सिडी' : 'Govt Schemes',
      sub: language === 'punjabi' ? 'ਸੁਪਰ ਸੀਡਰ 50-80% ਸਬਸਿਡੀ, ਸੋਲਰ ਪੰਪ, KCC' : 'PM-KISAN, Super Seeder, Solar pump eligibility',
      icon: Building2,
      color: 'from-blue-700 to-blue-900',
      badge: 'Active 2026',
    },
    {
      id: 'marketplace',
      title: language === 'punjabi' ? 'ਸੰਦ ਅਤੇ ਟਰੈਕਟਰ ਮਾਰਕੀਟ' : language === 'hindi' ? 'कृषि यंत्र व ट्रैक्टर बाजार' : 'Machinery Hub',
      sub: language === 'punjabi' ? 'ਟਰੈਕਟਰ, ਸੁਪਰ ਸੀਡਰ ਖਰੀਦੋ, ਵੇਚੋ ਜਾਂ ਕਿਰਾਏ ਲਓ' : 'Buy, sell or rent farm equipment across Punjab',
      icon: Tractor,
      color: 'from-stone-700 to-stone-900',
      badge: 'Verified Farmers',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14532D] via-[#114626] to-[#0a2f18] text-white pt-8 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#EABF48]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EABF48_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EABF48]/20 border border-[#EABF48]/40 text-[#EABF48] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'punjabi'
                    ? 'ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਦਾ ਸਭ ਤੋਂ ਭਰੋਸੇਮੰਦ ਐਗਰੀਟੈੱਕ ਪਲੇਟਫਾਰਮ'
                    : 'Punjab’s Dedicated Agritech Intelligence'}
                </span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  <span className="text-[#EABF48] block mb-1">
                    {t.heroGreeting}
                  </span>
                  <span>{t.appName}</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#EDEDD6] max-w-2xl font-medium leading-relaxed">
                  {t.tagline}
                </p>
                <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                  {t.heroSub}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={openVoiceAssistant}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#EABF48] to-[#f4cf68] text-[#14532D] font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 glow-golden"
                >
                  <div className="w-7 h-7 rounded-full bg-[#14532D] text-[#EABF48] flex items-center justify-center animate-pulse">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span>{t.askVoiceAI}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('crop-doctor')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-sm"
                >
                  <Stethoscope className="w-5 h-5 text-[#EABF48]" />
                  <span>{t.navCropDoctor}</span>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </button>

                {openVideoAssistant && (
                  <button
                    type="button"
                    onClick={openVideoAssistant}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 border border-red-400/40"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                    <Video className="w-5 h-5 text-amber-300" />
                    <span>{language === 'punjabi' ? '📹 ਲਾਈਵ ਕੈਮਰਾ ਸਕੈਨ' : language === 'hindi' ? '📹 लाइव कैमरा स्कैन' : '📹 Live Camera Scan'}</span>
                  </button>
                )}
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <p className="text-xl sm:text-2xl font-black text-[#EABF48]">₹2,425</p>
                  <p className="text-[11px] text-white/70">ਕਣਕ MSP 2026/Qtl</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <p className="text-xl sm:text-2xl font-black text-[#EABF48]">80% ਤੱਕ</p>
                  <p className="text-[11px] text-white/70">ਸੁਪਰ ਸੀਡਰ ਸਬਸਿਡੀ</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <p className="text-xl sm:text-2xl font-black text-[#EABF48]">24x7</p>
                  <p className="text-[11px] text-white/70">PAU ਏ.ਆਈ. ਸਹਾਇਕ</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero: Punjab Weather & Spray Advisory Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-2.5">
                    <CloudSun className="w-7 h-7 text-[#EABF48]" />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        {language === 'punjabi' ? 'ਮੌਸਮ ਅਤੇ ਸਪਰੇਅ ਸਲਾਹ' : 'Live Weather & Spray Window'}
                      </h3>
                      <p className="text-xs text-[#EDEDD6]">ਪੰਜਾਬ ਖੇਤੀ ਮੌਸਮ ਕੇਂਦਰ</p>
                    </div>
                  </div>

                  {/* District Dropdown */}
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-[#14532D] text-xs font-bold text-[#EABF48] rounded-xl px-2.5 py-1.5 border border-[#EABF48]/40 focus:outline-none cursor-pointer"
                  >
                    {PUNJAB_DISTRICTS.slice(0, 8).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weather main metrics */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <span className="text-4xl sm:text-5xl font-black text-[#EABF48]">
                      {currentWeather.temp}°C
                    </span>
                    <p className="text-xs text-white/80 font-medium mt-1">
                      {currentWeather.condition} in {currentWeather.district}
                    </p>
                  </div>

                  <div className="text-right space-y-1 text-xs">
                    <p className="flex items-center justify-end gap-1 text-white/90">
                      <Droplets className="w-3.5 h-3.5 text-blue-300" />
                      ਸਿੱਲ੍ਹ (Humidity): <strong>{currentWeather.humidity}%</strong>
                    </p>
                    <p className="flex items-center justify-end gap-1 text-white/90">
                      <Wind className="w-3.5 h-3.5 text-emerald-300" />
                      ਹਵਾ (Wind): <strong>{currentWeather.windSpeedKmh} km/h</strong>
                    </p>
                    <p className="text-white/70">
                      ਮੀਂਹ (Rain): <strong>{currentWeather.rainProbability}%</strong>
                    </p>
                  </div>
                </div>

                {/* Spray Advisory Banner */}
                <div className="rounded-2xl p-3.5 bg-emerald-950/60 border border-emerald-400/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#EABF48] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {language === 'punjabi' ? 'ਅੱਜ ਸਪਰੇਅ ਲਈ ਸਥਿਤੀ:' : 'Spray Advisory:'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      {currentWeather.sprayAdvisory}
                    </span>
                  </div>
                  <p className="text-xs text-[#EDEDD6] leading-relaxed">
                    {currentWeather.sprayReason}
                  </p>
                </div>

                {/* 5-day mini strip */}
                <div className="grid grid-cols-5 gap-1.5 pt-3.5 mt-2 border-t border-white/10 text-center text-[10px]">
                  {currentWeather.forecast.map((f, i) => (
                    <div key={i} className="bg-white/5 rounded-lg py-1.5 px-1">
                      <p className="font-semibold text-white/80">{f.day}</p>
                      <p className="font-bold text-[#EABF48] mt-0.5">{f.tempMax}°</p>
                      <p className="text-white/50">{f.condition.slice(0, 5)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TICKER: LIVE MANDI PRICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-extrabold text-xs uppercase tracking-wider text-[#14532D]">
              {language === 'punjabi' ? 'ਲਾਈਵ ਮੰਡੀ ਭਾਅ' : 'Live Mandi Snapshot'}
            </span>
            <span className="text-gray-300">|</span>
          </div>

          <div className="flex-1 overflow-x-auto whitespace-nowrap flex items-center gap-4 text-xs scrollbar-none py-1">
            {(liveRates.length > 0 ? liveRates : []).slice(0, 6).map((m) => (
              <div
                key={m.id}
                onClick={() => setCurrentTab('mandi')}
                className="inline-flex items-center gap-2 bg-[#F7F7E9] hover:bg-[#EABF48]/20 px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer transition-colors"
              >
                <span className="font-bold text-[#14532D]">{m.mandi.split(' ')[0]}</span>
                <span className="text-gray-600 font-medium">{m.crop}</span>
                <span className="font-extrabold text-emerald-700">₹{m.modalPrice}/Qtl</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    m.trend === 'up'
                      ? 'bg-emerald-100 text-emerald-700'
                      : m.trend === 'down'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {m.trend === 'up' ? '+' : m.trend === 'down' ? '-' : ''}{m.trendPercent}%
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('mandi')}
            className="text-xs font-bold text-[#14532D] hover:text-[#4D9B55] flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {language === 'punjabi' ? 'ਸਾਰੇ ਭਾਅ ਦੇਖੋ' : 'View All Mandis'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CORE 6 FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#4D9B55]">
            ਸਮਾਰਟ ਡਿਜੀਟਲ ਸੇਵਾਵਾਂ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D]">
            {language === 'punjabi'
              ? 'ਕਿਸਾਨ ਵੀਰਾਂ ਲਈ ਮੁੱਖ ਸੁਵਿਧਾਵਾਂ'
              : 'Empowering Farmers with Smart Tools'}
          </h2>
          <p className="text-sm text-gray-600">
            {language === 'punjabi'
              ? 'ਹਰ ਸੁਵਿਧਾ ਪੰਜਾਬ ਦੀ ਖੇਤੀ, ਫਸਲਾਂ ਅਤੇ ਮੰਡੀਆਂ ਦੇ ਮੁਤਾਬਕ ਤਿਆਰ ਕੀਤੀ ਗਈ ਹੈ।'
              : 'Designed with PAU Ludhiana agronomy standards and Punjab Mandi Board verified data.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrentTab(feat.id)}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border border-gray-200/80 cursor-pointer group flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#F7F7E9] group-hover:bg-[#EABF48]/30 flex items-center justify-center text-[#14532D] transition-colors shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#14532D]/10 text-[#14532D]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#14532D] group-hover:text-[#4D9B55] transition-colors mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feat.sub}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#14532D]">
                  <span>
                    {language === 'punjabi' ? 'ਵਰਤੋਂ ਕਰੋ' : 'Open Tool'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F7F7E9] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4 text-[#14532D]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SEASONAL ADVISORY ALERT (PAU Ludhiana Rabi 2026 Advice) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                    PAU ਸੀਜ਼ਨਲ ਅਲਰਟ (Seasonal Advisory)
                  </span>
                  <span className="text-xs text-gray-500">ਹਾੜ੍ਹੀ ਫਸਲ 2026</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#14532D]">
                  {language === 'punjabi'
                    ? 'ਕਣਕ ਦੀ ਪਹਿਲੀ ਸਿੰਚਾਈ (Crown Root Stage) ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਨਿਗਰਾਨੀ'
                    : 'Wheat 1st Irrigation & Yellow Rust Surveillance Advisory'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 max-w-3xl leading-relaxed">
                  {language === 'punjabi'
                    ? 'ਬਿਜਾਈ ਤੋਂ 21-25 ਦਿਨਾਂ ਬਾਅਦ ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਹਲਕਾ ਪਾਣੀ ਲਗਾਓ। ਪਾਣੀ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਪ੍ਰਤੀ ਏਕੜ 1 ਬੋਰੀ ਯੂਰੀਆ ਅਤੇ 25 ਕਿੱਲੋ ਜ਼ਿੰਕ 21% ਪਾਓ। ਨਦੀਨ ਨਾਸ਼ਕ ਸਪਰੇਅ ਬਿਜਾਈ ਤੋਂ 30-35 ਦਿਨਾਂ ਬਾਅਦ ਹੀ ਕਰੋ।'
                    : 'Apply 1st light irrigation at 21-25 days after sowing (CRI stage). Top-dress 1 bag urea + 25kg zinc sulphate. Spray herbicides only at 30-35 days stage with 150L water.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('crop-doctor')}
              className="px-5 py-3 rounded-xl bg-[#14532D] text-[#EABF48] font-bold text-xs sm:text-sm hover:bg-[#0a2f18] transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              {language === 'punjabi' ? 'ਫਸਲ ਡਾਕਟਰ ਨਾਲ ਜਾਂਚ ਕਰੋ' : 'Open Crop Doctor'}
            </button>
          </div>
        </div>
      </section>

      {/* VERIFIED PRODUCTS TEASER (Price transparency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#14532D]">
              {language === 'punjabi'
                ? 'ਖਾਦ ਅਤੇ ਦਵਾਈਆਂ ਦੇ ਅਸਲ ਭਾਅ (MRP ਚੈੱਕਰ)'
                : 'Verified Fertilizer & Pesticide Rates'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              ਕੋਈ ਵੀ ਡੀਲਰ ਸਰਕਾਰੀ MRP ਤੋਂ ਵੱਧ ਰੇਟ ਨਹੀਂ ਲੈ ਸਕਦਾ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('price-checker')}
            className="text-xs sm:text-sm font-bold text-[#14532D] hover:text-[#4D9B55] flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'punjabi' ? 'ਸਾਰੇ ਪ੍ਰੋਡਕਟ' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => setCurrentTab('price-checker')}
              className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">{p.packSize}</span>
                </div>
                <h4 className="font-bold text-sm text-[#14532D] line-clamp-1">{p.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{p.brand}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500">ਸਰਕਾਰੀ ਰੇਟ: </span>
                  <span className="text-sm font-extrabold text-[#14532D]">₹{p.verifiedDealerPrice}</span>
                </div>
                <span className="text-[11px] font-bold text-[#4D9B55]">ਵੈਰੀਫਾਈਡ ✓</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET THE FOUNDER – JASS BASRAN SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0a2f18] via-[#14532D] to-[#1c6e3d] rounded-3xl p-6 sm:p-10 border-2 border-[#EABF48]/40 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#EABF48]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Avatar & Identity */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-[#EABF48] to-[#fce588] p-1.5 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-[#0a2f18] flex flex-col items-center justify-center p-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#EABF48] mb-1">JB</span>
                    <span className="text-sm font-bold text-white tracking-wide">ਜੱਸ ਬਸਰਾਨ</span>
                    <span className="text-[11px] text-[#EDEDD6]">Jass Basran</span>
                  </div>
                </div>
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black bg-[#EABF48] text-[#14532D] shadow-md uppercase tracking-wider whitespace-nowrap">
                  ਸੰਸਥਾਪਕ (Founder)
                </span>
              </div>

              <div className="pt-2">
                <h4 className="text-lg font-black text-white">ਜੱਸ ਬਸਰਾਨ (Jass Basran)</h4>
                <p className="text-xs text-[#EABF48] font-semibold">Founder & Chief Designer</p>
                <p className="text-[11px] text-white/70">Digital Kisan Sathi</p>
              </div>
            </div>

            {/* Right Vision & Mission */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48]/20 border border-[#EABF48]/40 text-[#EABF48]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'punjabi' ? 'ਕਿਸਾਨ ਵੀਰਾਂ ਲਈ ਸਮਰਪਿਤ ਸੇਵਾ' : 'Built for Farmers by Jass Basran'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                "ਕੋਈ ਵੀ ਕਿਸਾਨ ਵੀਰ ਗ਼ਲਤ ਜਾਣਕਾਰੀ ਜਾਂ ਕਾਲਾਬਾਜ਼ਾਰੀ ਕਰਕੇ ਨੁਕਸਾਨ ਨਾ ਝੱਲੇ – ਇਹੀ ਮੇਰਾ ਮੁੱਖ ਮਕਸਦ ਹੈ।"
              </h3>

              <p className="text-xs sm:text-sm text-[#EDEDD6] leading-relaxed max-w-2xl">
                ਜੱਸ ਬਸਰਾਨ (Jass Basran) ਨੇ ਇਹ ਪਲੇਟਫਾਰਮ ਖ਼ਾਸ ਤੌਰ 'ਤੇ ਪੰਜਾਬ ਅਤੇ ਭਾਰਤ ਦੇ ਕਿਸਾਨਾਂ ਦੀਆਂ ਰੋਜ਼ਾਨਾ ਮੁਸ਼ਕਲਾਂ ਨੂੰ ਹੱਲ ਕਰਨ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਹੈ — ਜਿਸ ਵਿੱਚ ਖਾਦਾਂ ਦੇ ਸਰਕਾਰੀ MRP ਭਾਅ, ਲਾਈਵ ਮੰਡੀ ਰੇਟ, ਏ.ਆਈ. ਫਸਲ ਡਾਕਟਰ ਅਤੇ ਪੰਜਾਬੀ ਆਵਾਜ਼ ਸਹਾਇਕ ਸ਼ਾਮਲ ਹਨ।
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('about')}
                  className="px-6 py-3 rounded-2xl bg-[#EABF48] text-[#14532D] font-black text-xs sm:text-sm hover:bg-[#d4a732] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>ਸੰਸਥਾਪਕ ਦੀ ਪੂਰੀ ਕਹਾਣੀ ਪੜ੍ਹੋ (About Jass Basran)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={openVoiceAssistant}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-[#EABF48]" />
                  <span>ਸਵਾਲ ਪੁੱਛੋ: "ਇਹ ਐਪ ਕਿਸਨੇ ਬਣਾਈ ਹੈ?"</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FARMER TESTIMONIAL / SUCCESS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14532D] text-white rounded-3xl p-6 sm:p-10 border border-[#EABF48]/30 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              ਕਿਸਾਨਾਂ ਦਾ ਤਜਰਬਾ (Punjab Farmer Trust)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              "ਡਿਜੀਟਲ ਕਿਸਾਨ ਸਾਥੀ ਨਾਲ ਮੇਰੇ ਕਣਕ ਦੇ ਪ੍ਰਤੀ ਏਕੜ ₹2,800 ਦੀ ਬੱਚਤ ਹੋਈ ਅਤੇ ਨਦੀਨਾਂ ਦਾ ਸਮੇਂ ਸਿਰ ਹੱਲ ਮਿਲਿਆ।"
            </h3>
            <p className="text-xs sm:text-sm text-[#EDEDD6]">
              – ਸੁਖਵਿੰਦਰ ਸਿੰਘ, ਪਿੰਡ ਭੈਣੀ ਸਾਹਿਬ, ਜ਼ਿਲ੍ਹਾ ਲੁਧਿਆਣਾ (ਕਾਸ਼ਤਕਾਰ: 15 ਏਕੜ)
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setCurrentTab('community')}
                className="px-5 py-2.5 rounded-xl bg-white text-[#14532D] font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
              >
                ਕਿਸਾਨ ਮੰਚ ਨਾਲ ਜੁੜੋ (Join Community)
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('marketplace')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                ਸੰਦ ਕਿਰਾਏ ਲਓ (Rent Machinery)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

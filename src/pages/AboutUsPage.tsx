import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sprout,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  MessageSquare,
  TrendingUp,
  Tag,
  Stethoscope,
  Mic,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface AboutUsPageProps {
  language: Language;
  setCurrentTab: (tab: string) => void;
  openVoiceAssistant: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  language,
  setCurrentTab,
  openVoiceAssistant,
}) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [message, setMessage] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !message) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFarmerName('');
      setPhone('');
      setVillage('');
      setMessage('');
      setFeedbackSent(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14532D] via-[#0f3d21] to-[#0a2f18] text-white rounded-3xl p-6 sm:p-12 border-2 border-[#EABF48]/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#EABF48]/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D] shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>
              {language === 'punjabi'
                ? 'ਕਿਸਾਨ ਸੇਵਾ ਨੂੰ ਸਮਰਪਿਤ ਪਹਿਲਕਦਮੀ'
                : language === 'hindi'
                ? 'किसान सेवा को समर्पित पहल'
                : 'Dedicated Farmer Empowerment Initiative'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {language === 'punjabi' ? (
              <>
                ਸਾਡੇ ਬਾਰੇ & <span className="text-[#EABF48]">ਸੰਸਥਾਪਕ ਜੱਸ ਬਸਰਾਨ (Jass Basran)</span>
              </>
            ) : language === 'hindi' ? (
              <>
                हमारे बारे में & <span className="text-[#EABF48]">संस्थापक जस्स बसरान (Jass Basran)</span>
              </>
            ) : (
              <>
                About Us & <span className="text-[#EABF48]">Founder Jass Basran</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#EDEDD6] leading-relaxed">
            {language === 'punjabi'
              ? 'ਡਿਜੀਟਲ ਕਿਸਾਨ ਸਾਥੀ (Digital Kisan Sathi) ਪੰਜਾਬ ਅਤੇ ਭਾਰਤ ਦੇ ਕਿਸਾਨ ਵੀਰਾਂ ਦੀ ਨਿਰਸਵਾਰਥ ਮਦਦ, ਪਾਰਦਰਸ਼ੀ ਖੇਤੀ ਜਾਣਕਾਰੀ ਅਤੇ ਕਾਲਾਬਾਜ਼ਾਰੀ ਦੇ ਖਾਤਮੇ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਇੱਕ ਆਧੁਨਿਕ ਡਿਜੀਟਲ ਪਲੇਟਫਾਰਮ ਹੈ।'
              : language === 'hindi'
              ? 'डिजिटल किसान साथी (Digital Kisan Sathi) पंजाब व भारतीय किसानों की निस्वार्थ सहायता, पारदर्शी कृषि जानकारी और कालाबाजारी रोकने हेतु बनाया गया एक आधुनिक डिजिटल प्लेटफॉर्म है।'
              : 'Digital Kisan Sathi is a modern agritech initiative conceptualized and designed to protect, guide, and empower Indian farmers with verified prices, AI crop health diagnostics, and transparent technology.'}
          </p>
        </div>
      </div>

      {/* FOUNDER SPOTLIGHT CARD */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Founder Visual Badge */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {/* Profile Avatar / Photo Frame */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-[#14532D] to-[#4D9B55] p-1.5 shadow-2xl border-4 border-[#EABF48] overflow-hidden flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-[#0a2f18] flex flex-col items-center justify-center text-center p-4 relative group">
                  <div className="w-20 h-20 rounded-full bg-[#EABF48] text-[#14532D] flex items-center justify-center shadow-lg font-black text-3xl mb-2">
                    JB
                  </div>
                  <span className="font-extrabold text-lg text-white tracking-wide">
                    ਜੱਸ ਬਸਰਾਨ
                  </span>
                  <span className="text-xs text-[#EABF48] font-semibold">
                    Jass Basran
                  </span>
                  <div className="absolute inset-0 bg-[#14532D]/90 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-3">
                    <Heart className="w-6 h-6 text-[#EABF48] fill-[#EABF48] mb-1" />
                    <p className="text-[11px] font-bold">Dedicated to Punjab Farmers</p>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-3 -right-2 bg-[#EABF48] text-[#14532D] px-3.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 border-2 border-white">
                <ShieldCheck className="w-4 h-4" />
                <span>Founder & Designer</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#14532D]">
                ਜੱਸ ਬਸਰਾਨ (Jass Basran)
              </h3>
              <p className="text-xs font-bold text-[#4D9B55] uppercase tracking-wider">
                Founder, Creator & Chief Architect
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Punjab, India</span>
              </div>
            </div>
          </div>

          {/* Founder Story & Vision */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-[#14532D] text-xs font-bold border border-emerald-200">
              <Award className="w-4 h-4 text-[#EABF48]" />
              <span>
                {language === 'punjabi' ? 'ਸੰਸਥਾਪਕ ਦਾ ਸੁਨੇਹਾ (Founder’s Message)' : 'Message from Founder Jass Basran'}
              </span>
            </div>

            {/* Founder Quote */}
            <div className="bg-[#F7F7E9] p-5 sm:p-6 rounded-2xl border-l-4 border-[#EABF48] shadow-inner text-gray-800 italic leading-relaxed text-sm sm:text-base">
              "{language === 'punjabi'
                ? 'ਮੇਰਾ ਇੱਕੋ-ਇੱਕ ਸੁਪਨਾ ਹੈ ਕਿ ਪੰਜਾਬ ਅਤੇ ਪੂਰੇ ਦੇਸ਼ ਦਾ ਕੋਈ ਵੀ ਕਿਸਾਨ ਵੀਰ ਗ਼ਲਤ ਜਾਣਕਾਰੀ, ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਕਾਲਾਬਾਜ਼ਾਰੀ ਜਾਂ ਤਕਨੀਕ ਦੀ ਕਮੀ ਕਰਕੇ ਨੁਕਸਾਨ ਨਾ ਝੱਲੇ। ਮੈਂ ਡਿਜੀਟਲ ਕਿਸਾਨ ਸਾਥੀ ਨੂੰ ਇਸ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਹੈ ਤਾਂ ਜੋ ਸਾਡੇ ਕਿਸਾਨਾਂ ਨੂੰ ਆਪਣੀ ਬੋਲੀ (ਪੰਜਾਬੀ ਤੇ ਹਿੰਦੀ) ਵਿੱਚ ਬੋਲ ਕੇ ਸਹੀ ਸਲਾਹ, ਸਰਕਾਰੀ ਐੱਮ.ਆਰ.ਪੀ. ਭਾਅ ਅਤੇ ਲਾਈਵ ਮੰਡੀ ਰੇਟ ਬਿਨਾਂ ਕਿਸੇ ਦਲਾਲ ਤੋਂ ਸਿੱਧੇ ਮਿਲ ਸਕਣ।'
                : language === 'hindi'
                ? 'मेरा एकमात्र उद्देश्य है कि पंजाब और पूरे देश का कोई भी किसान भाई गलत जानकारी, कीटनाशकों की कालाबाजारी या तकनीकी जानकारी के अभाव में नुकसान न उठाए। मैंने डिजिटल किसान साथी को इसलिए डिजाइन किया है ताकि हमारे किसान भाइयों को अपनी भाषा में खाद-दवा के सही दाम, लाइव मंडी भाव और फसल सुरक्षा की सटीक सलाह सीधे मिल सके।'
                : 'My mission is to ensure that no farmer suffers due to lack of transparent information, pesticide overcharging, or technical barriers. I designed Digital Kisan Sathi to bring verified official MRPs, AI voice intelligence in Punjabi, and live mandi prices directly into the hands of our hardworking farmers.'}"
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>ਜੱਸ ਬਸਰਾਨ (Jass Basran)</strong> ਨੇ ਪੰਜਾਬ ਦੇ ਖੇਤਾਂ ਵਿੱਚ ਕਿਸਾਨਾਂ ਦੀਆਂ ਰੋਜ਼ਾਨਾ ਮੁਸ਼ਕਲਾਂ—ਜਿਵੇਂ ਕਿ ਡੀ.ਏ.ਪੀ. ਅਤੇ ਯੂਰੀਆ ਨਾਲ ਜ਼ਬਰਦਸਤੀ ਵਾਧੂ ਦਵਾਈਆਂ ਲਾਉਣਾ, ਨਕਲੀ ਬੀਜ, ਫਸਲੀ ਬਿਮਾਰੀਆਂ ਦੀ ਗ਼ਲਤ ਪਛਾਣ ਅਤੇ ਮੰਡੀ ਵਿੱਚ ਆੜ੍ਹਤੀਆਂ/ਵਪਾਰੀਆਂ ਵੱਲੋਂ ਭਾਅ ਵਿੱਚ ਘਪਲੇ—ਨੂੰ ਨੇੜਿਓਂ ਦੇਖ ਕੇ ਇਹ ਪਲੇਟਫਾਰਮ ਆਪਣੇ ਹੱਥੀਂ ਤਿਆਰ ਕੀਤਾ।
              </p>
              <p>
                ਉਹਨਾਂ ਨੇ ਇਸ ਵਿੱਚ <strong>ਗੂਗਲ ਜੈਮਿਨੀ ਏ.ਆਈ. (Gemini AI)</strong>, ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਲੁਧਿਆਣਾ ਦੀ ਪ੍ਰਮਾਣਿਤ ਖੋਜ, ਅਤੇ ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਦੇ ਲਾਈਵ ਅੰਕੜਿਆਂ ਨੂੰ ਇੱਕੋ ਆਸਾਨ ਐਪ ਵਿੱਚ ਜੋੜਿਆ ਹੈ, ਤਾਂ ਜੋ ਅਣਪੜ੍ਹ ਜਾਂ ਬਜ਼ੁਰਗ ਕਿਸਾਨ ਵੀ ਸਿਰਫ਼ ਮਾਈਕ ਦਾ ਬਟਨ ਦਬਾ ਕੇ ਬੋਲ ਕੇ ਆਪਣਾ ਹੱਲ ਲੱਭ ਸਕਣ।
              </p>
            </div>

            {/* Quick Action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openVoiceAssistant}
                className="px-5 py-2.5 rounded-xl bg-[#14532D] text-[#EABF48] font-bold text-xs hover:bg-[#0a2f18] transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>ਏ.ਆਈ. ਆਵਾਜ਼ ਸਹਾਇਕ ਅਜ਼ਮਾਓ</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('price-checker')}
                className="px-5 py-2.5 rounded-xl bg-[#EABF48] text-[#14532D] font-bold text-xs hover:bg-[#d4a732] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Tag className="w-4 h-4" />
                <span>ਐੱਮ.ਆਰ.ਪੀ. ਭਾਅ ਚੈੱਕਰ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JASS BASRAN CREATED THIS PLATFORM (4 PILLARS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4D9B55]">
            ਸਾਡੇ 4 ਮੁੱਖ ਸਿਧਾਂਤ (Core Pillars)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532D]">
            ਜੱਸ ਬਸਰਾਨ (Jass Basran) ਵੱਲੋਂ ਕਿਸਾਨਾਂ ਲਈ ਤਿਆਰ ਕੀਤੀਆਂ 4 ਵੱਡੀਆਂ ਸੁਵਿਧਾਵਾਂ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-3 hover:border-[#14532D] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Tag className="w-6 h-6 text-[#14532D]" />
            </div>
            <h3 className="font-extrabold text-base text-[#14532D]">
              1. ਕਾਲਾਬਾਜ਼ਾਰੀ ਰੋਕੂ ਸਿਸਟਮ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              ਕੋਈ ਵੀ ਡੀਲਰ ਯੂਰੀਆ ਜਾਂ ਡੀ.ਏ.ਪੀ. ਨਾਲ ਜ਼ਬਰਦਸਤੀ ਹੋਰ ਦਵਾਈਆਂ ਨਹੀਂ ਲਾ ਸਕਦਾ। ਕਿਸਾਨ ਐਪ ਰਾਹੀਂ ਸਿੱਧੀ ਵੱਧ ਰੇਟ ਦੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰ ਸਕਦੇ ਹਨ।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-3 hover:border-[#14532D] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6 text-[#14532D]" />
            </div>
            <h3 className="font-extrabold text-base text-[#14532D]">
              2. ਏ.ਆਈ. ਫਸਲ ਡਾਕਟਰ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              ਕਣਕ ਦੀ ਪੀਲੀ ਕੁੰਗੀ, ਗੁੱਲੀ ਡੰਡਾ, ਸਬਜ਼ੀਆਂ ਦੇ ਕੀੜੇ ਜਾਂ ਫਲਾਂ ਦੇ ਰੋਗਾਂ ਦੀ ਫੋਟੋ ਖਿੱਚ ਕੇ ਸਕਿੰਟਾਂ ਵਿੱਚ PAU ਸਿਫ਼ਾਰਸ਼ਿਤ ਦਵਾਈ ਪਤਾ ਕਰੋ।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-3 hover:border-[#14532D] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6 text-[#14532D]" />
            </div>
            <h3 className="font-extrabold text-base text-[#14532D]">
              3. ਖੰਨਾ ਤੇ ਪੰਜਾਬ ਮੰਡੀ ਲਾਈਵ ਭਾਅ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              ਏਸ਼ੀਆ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਅਨਾਜ ਮੰਡੀ ਖੰਨਾ, ਲੁਧਿਆਣਾ, ਬਠਿੰਡਾ ਸਮੇਤ ਬਾਸਮਤੀ, ਕਣਕ, ਨਰਮਾ ਅਤੇ ਸਰ੍ਹੋਂ ਦੇ ਅਸਲ ਭਾਅ ਰੋਜ਼ਾਨਾ ਅਪਡੇਟ ਹੁੰਦੇ ਹਨ।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-3 hover:border-[#14532D] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
              <Mic className="w-6 h-6 text-[#14532D]" />
            </div>
            <h3 className="font-extrabold text-base text-[#14532D]">
              4. ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਆਵਾਜ਼ ਸਹਾਇਕ
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              ਕਿਸੇ ਵੀ ਕਿਸਾਨ ਨੂੰ ਟਾਈਪ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ ਤੇ ਸਵਾਲ ਪੁੱਛੋ, ਏ.ਆਈ. ਸਾਥੀ ਬੋਲ ਕੇ ਹੀ ਸਹੀ ਜਵਾਬ ਦੇਵੇਗਾ।
            </p>
          </div>
        </div>
      </section>

      {/* SEND FEEDBACK OR MESSAGE DIRECTLY TO FOUNDER JASS BASRAN */}
      <section className="bg-gradient-to-r from-[#14532D] to-[#1e6f3e] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              ਸਿੱਧਾ ਸੰਪਰਕ (Contact Founder & Team)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              ਸੰਸਥਾਪਕ ਜੱਸ ਬਸਰਾਨ (Jass Basran) ਨਾਲ ਸਿੱਧਾ ਸੁਨੇਹਾ ਜਾਂ ਸੁਝਾਅ ਸਾਂਝਾ ਕਰੋ
            </h3>
            <p className="text-xs sm:text-sm text-[#EDEDD6] leading-relaxed">
              ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਐਪ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਦਾ ਕੋਈ ਸੁਝਾਅ ਹੈ ਜਾਂ ਕਿਸੇ ਖੇਤੀ ਸੇਵਾ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ, ਤਾਂ ਹੇਠਾਂ ਆਪਣਾ ਸੁਨੇਹਾ ਭੇਜੋ।
            </p>
            <div className="pt-2 space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EABF48]" />
                <span>100% ਕਿਸਾਨਾਂ ਲਈ ਮੁਫ਼ਤ ਅਤੇ ਗੈਰ-ਮੁਨਾਫ਼ਾ ਸੇਵਾ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EABF48]" />
                <span>ਹਰ ਕਿਸਾਨ ਦੇ ਸੁਝਾਅ ਦਾ ਪੂਰਾ ਸਤਿਕਾਰ</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {feedbackSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#14532D]">ਧੰਨਵਾਦ ਕਿਸਾਨ ਵੀਰ ਜੀ!</h4>
                <p className="text-xs text-gray-600">
                  ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਸੰਸਥਾਪਕ ਜੱਸ ਬਸਰਾਨ (Jass Basran) ਅਤੇ ਟੀਮ ਕੋਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪਹੁੰਚ ਗਿਆ ਹੈ।
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      ਕਿਸਾਨ ਦਾ ਨਾਂ (Your Name)*
                    </label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      placeholder="ਜਿਵੇਂ ਹਰਪ੍ਰੀਤ ਸਿੰਘ..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#14532D] focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      ਫ਼ੋਨ ਨੰਬਰ (Mobile Number)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765-XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#14532D] focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    ਪਿੰਡ ਅਤੇ ਜ਼ਿਲ੍ਹਾ (Village / District)
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="ਜਿਵੇਂ ਪਿੰਡ ਸਮਰਾਲਾ, ਲੁਧਿਆਣਾ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#14532D] focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    ਸੁਨੇਹਾ / ਸੁਝਾਅ (Message for Jass Basran)*
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ਆਪਣਾ ਸੁਝਾਅ ਜਾਂ ਖੇਤੀ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#14532D] focus:outline-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#14532D] text-[#EABF48] font-bold text-xs hover:bg-[#0a2f18] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ਸੁਨੇਹਾ ਭੇਜੋ (Send Message to Jass Basran)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_HELPLINES } from '../data/mockData';

interface FooterProps {
  language: Language;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, setCurrentTab }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#0a2f18] text-white pt-14 pb-24 md:pb-12 border-t-4 border-[#EABF48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Helplines Banner */}
        <div className="bg-[#14532D] rounded-3xl p-6 sm:p-8 mb-12 border border-[#EABF48]/30 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D] mb-2">
                24x7 ਕਿਸਾਨ ਸਹਾਇਤਾ (Farmer Helpline)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {language === 'punjabi'
                  ? 'ਕਿਸੇ ਵੀ ਖੇਤੀ ਸਮੱਸਿਆ ਜਾਂ ਮਸ਼ਵਰੇ ਲਈ ਮੁਫ਼ਤ ਕਾਲ ਕਰੋ'
                  : 'Free Emergency Agricultural Advisory Helplines'}
              </h3>
              <p className="text-sm text-[#EDEDD6] mt-1">
                PAU Ludhiana agricultural scientists and Kisan Call Centre experts are available.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              {MOCK_HELPLINES.slice(0, 2).map((h, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-4 border border-white/15">
                  <p className="text-xs text-[#EABF48] font-semibold">{h.name}</p>
                  <a
                    href={`tel:${h.number.replace(/-/g, '')}`}
                    className="text-lg font-extrabold text-white hover:text-[#EABF48] transition-colors flex items-center gap-2 mt-0.5"
                  >
                    <PhoneCall className="w-4 h-4 text-[#EABF48]" />
                    {h.number}
                  </a>
                  <p className="text-[11px] text-white/70 mt-1">{h.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EABF48] flex items-center justify-center text-[#14532D]">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                DIGITAL KISAN SATHI
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              ਕਿਸਾਨ ਦੀ ਆਪਣੀ ਡਿਜੀਟਲ ਸੇਵਾ – ਸਹੀ ਜਾਣਕਾਰੀ, ਸਹੀ ਭਾਅ, ਚੰਗੀ ਖੇਤੀ।
            </p>
            <p className="text-xs text-white/60">
              Dedicated agritech intelligence platform for Indian farmers, especially Punjab wheat, paddy, basmati, and cotton growers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#EABF48]">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in PAU Ludhiana & AGMARKNET data</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 border border-[#EABF48]/30 space-y-1">
              <span className="text-[10px] text-[#EABF48] font-bold uppercase tracking-wider block">
                ਸੰਸਥਾਪਕ (Founder & Creator)
              </span>
              <p className="text-sm font-black text-white">
                ਜੱਸ ਬਸਰਾਨ (Jass Basran)
              </p>
              <p className="text-[11px] text-[#EDEDD6] leading-snug">
                ਕਿਸਾਨ ਵੀਰਾਂ ਦੀ ਨਿਰਸਵਾਰਥ ਸਹਾਇਤਾ ਅਤੇ ਡਿਜੀਟਲ ਖੇਤੀ ਕ੍ਰਾਂਤੀ ਲਈ ਸਮਰਪਿਤ।
              </p>
            </div>
          </div>

          {/* Col 2: Core Agri Tools */}
          <div>
            <h4 className="font-bold text-sm text-[#EABF48] uppercase tracking-wider mb-4">
              {language === 'punjabi' ? 'ਮੁੱਖ ਸੇਵਾਵਾਂ (Core Services)' : 'Core Services'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('crop-doctor')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  🌾 AI ਫਸਲ ਡਾਕਟਰ (Disease Diagnosis)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('price-checker')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  🧪 ਖਾਦ ਅਤੇ ਕੀਟਨਾਸ਼ਕ MRP ਰੇਟ ਚੈੱਕਰ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('mandi')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  📈 ਖੰਨਾ ਅਤੇ ਪੰਜਾਬ ਮੰਡੀ ਭਾਅ ਲਾਈਵ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('calculators')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  🧮 ਕਣਕ ਅਤੇ ਝੋਨਾ ਮੁਨਾਫ਼ਾ ਕੈਲਕੁਲੇਟਰ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('schemes')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  🏛️ ਸੁਪਰ ਸੀਡਰ ਅਤੇ ਪੀ.ਐੱਮ. ਕਿਸਾਨ ਸਕੀਮਾਂ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Machinery */}
          <div>
            <h4 className="font-bold text-sm text-[#EABF48] uppercase tracking-wider mb-4">
              {language === 'punjabi' ? 'ਕਿਸਾਨ ਮੰਚ ਅਤੇ ਮੰਡੀ (Marketplace)' : 'Community & Market'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('marketplace')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  🚜 ਟਰੈਕਟਰ ਅਤੇ ਸੁਪਰ ਸੀਡਰ ਕਿਰਾਏ / ਵਿਕਰੀ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('community')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  💬 ਪੰਜਾਬ ਕਿਸਾਨ ਚਰਚਾ ਫੋਰਮ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('diary')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer"
                >
                  📓 ਖੇਤੀ ਖਰਚਾ ਅਤੇ ਆਮਦਨ ਡਾਇਰੀ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('price-checker')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer text-amber-300"
                >
                  ⚠️ ਵੱਧ ਰੇਟ ਲੈਣ ਵਾਲੇ ਡੀਲਰ ਦੀ ਸ਼ਿਕਾਇਤ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer text-[#EABF48] font-bold flex items-center gap-1.5"
                >
                  ⭐ ਸਾਡੇ ਬਾਰੇ & ਸੰਸਥਾਪਕ ਜੱਸ ਬਸਰਾਨ (Jass Basran)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentTab('admin')}
                  className="hover:text-[#EABF48] transition-colors cursor-pointer text-white/50"
                >
                  ⚙️ ਐਡਮਿਨ ਪੋਰਟਲ ਲੌਗਇਨ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Portals */}
          <div>
            <h4 className="font-bold text-sm text-[#EABF48] uppercase tracking-wider mb-4">
              {language === 'punjabi' ? 'ਸਰਕਾਰੀ ਲਿੰਕ (Official Portals)' : 'Official Links'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#EABF48] transition-colors flex items-center gap-1.5"
                >
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a
                  href="https://agrimachinerypb.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#EABF48] transition-colors flex items-center gap-1.5"
                >
                  Punjab Agri Machinery Subsidy <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#EABF48] transition-colors flex items-center gap-1.5"
                >
                  AGMARKNET Mandi Price Portal <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a
                  href="https://pau.edu"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#EABF48] transition-colors flex items-center gap-1.5"
                >
                  Punjab Agricultural University (PAU) <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} Digital Kisan Sathi • ਸੰਸਥਾਪਕ: <strong className="text-[#EABF48] font-bold">ਜੱਸ ਬਸਰਾਨ (Jass Basran)</strong>. ਕਿਸਾਨ ਵੀਰਾਂ ਦੀ ਸੇਵਾ ਅਤੇ ਮਦਦ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ।</p>
          <div className="flex items-center gap-1 text-white/70">
            <span>ਜੈ ਜਵਾਨ, ਜੈ ਕਿਸਾਨ</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>Punjab, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

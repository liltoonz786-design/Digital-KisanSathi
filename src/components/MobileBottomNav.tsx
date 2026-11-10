import React from 'react';
import { Home, Stethoscope, Mic, Video, TrendingUp, Calculator, Grid } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  openVoiceAssistant: () => void;
  openVideoAssistant?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language,
  openVoiceAssistant,
  openVideoAssistant,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14532D]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'home' ? 'text-[#EABF48] font-bold' : 'text-white/70'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navHome}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('crop-doctor')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'crop-doctor' ? 'text-[#EABF48] font-bold' : 'text-white/70'
          }`}
        >
          <div className="relative">
            <Stethoscope className="w-5 h-5" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <span className="text-[10px] mt-0.5">{t.navCropDoctor}</span>
        </button>

        {/* Center Elevated Voice + Video AI Button */}
        <button
          type="button"
          onClick={openVoiceAssistant}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#EABF48] to-[#fce588] text-[#14532D] flex items-center justify-center shadow-lg shadow-[#EABF48]/40 border-4 border-[#14532D] group-active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-0.5">
              <Mic className="w-5 h-5 animate-pulse" />
              <Video className="w-3.5 h-3.5 text-[#14532D]" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#EABF48] mt-0.5">
            {language === 'punjabi' ? 'ਏ.ਆਈ. ਆਵਾਜ਼/ਵੀਡੀਓ' : language === 'hindi' ? 'वॉयस/वीडियो' : 'Voice/Video'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('mandi')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'mandi' ? 'text-[#EABF48] font-bold' : 'text-white/70'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navMandi}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('calculators')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentTab === 'calculators' ? 'text-[#EABF48] font-bold' : 'text-white/70'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t.navCalculators}</span>
        </button>
      </div>
    </div>
  );
};

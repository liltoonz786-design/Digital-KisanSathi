import React from 'react';
import { Sprout, Mic, Video, PhoneCall, Globe, Menu, X, ShieldAlert, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  openVoiceAssistant: () => void;
  openVideoAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  openVoiceAssistant,
  openVideoAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'crop-doctor', label: t.navCropDoctor, badge: 'AI' },
    { id: 'price-checker', label: t.navPriceChecker },
    { id: 'calculators', label: t.navCalculators },
    { id: 'mandi', label: t.navMandi },
    { id: 'schemes', label: t.navSchemes },
    { id: 'marketplace', label: t.navMarketplace },
    { id: 'community', label: t.navCommunity },
    { id: 'diary', label: t.navDiary },
    { id: 'about', label: t.navAbout },
    { id: 'admin', label: t.navAdmin },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#14532D]/95 backdrop-blur-md border-b border-[#EABF48]/20 text-white shadow-lg transition-all duration-300">
      {/* Top micro-bar for emergency helplines & language */}
      <div className="bg-[#0a2f18] text-xs py-1.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#EABF48] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === 'punjabi' ? 'ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਸਿਫ਼ਾਰਸ਼ਾਂ ਅਧਾਰਿਤ' : 'PAU Ludhiana & ICAR Recommended Portal'}
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:flex items-center gap-1 text-white/80">
              <PhoneCall className="w-3 h-3 text-[#EABF48]" />
              Kisan Call Centre: <strong className="text-white hover:text-[#EABF48] transition-colors cursor-pointer">1800-180-1551</strong> (Toll Free)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#EABF48]" />
            <div className="inline-flex rounded-md p-0.5 bg-white/10 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('punjabi')}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  language === 'punjabi'
                    ? 'bg-[#EABF48] text-[#14532D] font-bold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hindi')}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  language === 'hindi'
                    ? 'bg-[#EABF48] text-[#14532D] font-bold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('english')}
                className={`px-2 py-0.5 rounded transition-all font-medium ${
                  language === 'english'
                    ? 'bg-[#EABF48] text-[#14532D] font-bold shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EABF48] to-[#d4a732] flex items-center justify-center shadow-md shadow-[#EABF48]/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-[#14532D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#EABF48] transition-colors">
                  DIGITAL KISAN SATHI
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EABF48]/20 text-[#EABF48] border border-[#EABF48]/30">
                  ਪੰਜਾਬ
                </span>
              </div>
              <p className="text-[11px] text-[#EDEDD6] hidden sm:block tracking-wide">
                {language === 'punjabi' ? 'ਕਿਸਾਨ ਦੀ ਆਪਣੀ ਡਿਜੀਟਲ ਸੇਵਾ' : 'Har Kisan Ka Digital Saathi'}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/15 text-[#EABF48] font-semibold shadow-inner'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-[#EABF48] text-[#14532D]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EABF48] rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Voice & Video Assistant & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {openVideoAssistant && (
              <button
                type="button"
                onClick={openVideoAssistant}
                title="ਲਾਈਵ ਵੀਡੀਓ ਕੈਮਰਾ ਸਹਾਇਕ (Live Video Crop AI)"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <Video className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'punjabi' ? 'ਵੀਡੀਓ ਸਹਾਇਕ' : language === 'hindi' ? 'वीडियो AI' : 'Video AI'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={openVoiceAssistant}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EABF48] to-[#f4cf68] text-[#14532D] font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer glow-golden"
            >
              <div className="w-5 h-5 rounded-full bg-[#14532D] text-[#EABF48] flex items-center justify-center animate-pulse">
                <Mic className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline font-semibold">
                {language === 'punjabi' ? 'ਆਵਾਜ਼ ਸਹਾਇਕ' : language === 'hindi' ? 'वॉयस असिस्टेंट' : 'Voice Assistant'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#14532D]/70 hidden lg:inline" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a2f18] border-b border-white/10 px-4 pt-3 pb-5 space-y-1.5 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-[#EABF48] text-[#14532D] font-bold'
                    : 'bg-white/5 text-white/90 hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#14532D] text-[#EABF48]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <span>PAU Kisan Helpline:</span>
            <a href="tel:01612401960" className="text-[#EABF48] font-bold">0161-2401960</a>
          </div>
        </div>
      )}
    </header>
  );
};

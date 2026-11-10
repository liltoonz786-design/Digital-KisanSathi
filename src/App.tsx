/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AIVoiceModal } from './components/AIVoiceModal';
import { LiveVideoModal } from './components/LiveVideoModal';

import { HomePage } from './pages/HomePage';
import { CropDoctorPage } from './pages/CropDoctorPage';
import { PriceCheckerPage } from './pages/PriceCheckerPage';
import { FarmingCalculatorsPage } from './pages/FarmingCalculatorsPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { MandiRatesPage } from './pages/MandiRatesPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CommunityPage } from './pages/CommunityPage';
import { ExpenseDiaryPage } from './pages/ExpenseDiaryPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('kisan_lang');
      if (savedLang === 'punjabi' || savedLang === 'hindi' || savedLang === 'english') {
        return savedLang;
      }
    } catch (e) {
      // ignore
    }
    return 'punjabi';
  });

  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState<boolean>(false);
  const [liveVideoModalOpen, setLiveVideoModalOpen] = useState<boolean>(false);

  const handleOpenVoice = () => {
    setLiveVideoModalOpen(false);
    setVoiceAssistantOpen(true);
  };

  const handleOpenVideo = () => {
    setVoiceAssistantOpen(false);
    setLiveVideoModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('kisan_lang', language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  // Scroll to top on tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7E9] text-[#1E293B]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        language={language}
        setLanguage={setLanguage}
        openVoiceAssistant={handleOpenVoice}
        openVideoAssistant={handleOpenVideo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === 'home' && (
              <HomePage
                language={language}
                setCurrentTab={handleTabChange}
                openVoiceAssistant={handleOpenVoice}
                openVideoAssistant={handleOpenVideo}
              />
            )}
            {currentTab === 'crop-doctor' && (
              <CropDoctorPage
                language={language}
                openVideoAssistant={handleOpenVideo}
              />
            )}
            {currentTab === 'price-checker' && <PriceCheckerPage language={language} />}
            {currentTab === 'calculators' && <FarmingCalculatorsPage language={language} />}
            {currentTab === 'schemes' && <GovernmentSchemesPage language={language} />}
            {currentTab === 'mandi' && <MandiRatesPage language={language} />}
            {currentTab === 'marketplace' && <MarketplacePage language={language} />}
            {currentTab === 'community' && <CommunityPage language={language} />}
            {currentTab === 'diary' && <ExpenseDiaryPage language={language} />}
            {currentTab === 'about' && (
              <AboutUsPage
                language={language}
                setCurrentTab={handleTabChange}
                openVoiceAssistant={handleOpenVoice}
              />
            )}
            {currentTab === 'admin' && <AdminPanelPage language={language} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global AI Voice Assistant Modal */}
      <AIVoiceModal
        isOpen={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
        language={language}
        onOpenLiveVideo={handleOpenVideo}
      />

      {/* Dedicated Edge-to-Edge Full-Screen Live Video & Speech Crop Doctor */}
      <LiveVideoModal
        isOpen={liveVideoModalOpen}
        onClose={() => setLiveVideoModalOpen(false)}
        language={language}
      />

      {/* Mobile Ergonomic Bottom Nav */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        language={language}
        openVoiceAssistant={handleOpenVoice}
        openVideoAssistant={handleOpenVideo}
      />

      {/* Footer */}
      <Footer language={language} setCurrentTab={handleTabChange} />
    </div>
  );
}

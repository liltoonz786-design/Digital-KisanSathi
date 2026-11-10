import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Mic,
  Barcode,
  Tag,
  ShieldAlert,
  CheckCircle,
  AlertOctagon,
  FileText,
  Filter,
  Building,
  Sparkles,
  PhoneCall,
  X,
  Send,
  Camera
} from 'lucide-react';
import { Language, ProductItem } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_PRODUCTS } from '../data/mockData';
import { processSpeechEvent } from '../utils/speechUtils';

interface PriceCheckerPageProps {
  language: Language;
}

export const PriceCheckerPage: React.FC<PriceCheckerPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Complaint Modal State
  const [showComplaintModal, setShowComplaintModal] = useState<boolean>(false);
  const [complaintForm, setComplaintForm] = useState({
    farmerName: '',
    phone: '',
    district: 'Ludhiana',
    dealerName: '',
    productName: '',
    mrp: '',
    chargedPrice: '',
    description: '',
  });
  const [complaintSubmitted, setComplaintSubmitted] = useState<boolean>(false);

  // Quote Request Modal State
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteProduct, setQuoteProduct] = useState<ProductItem | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);

  // Barcode Scanner Simulator State
  const [isScanningBarcode, setIsScanningBarcode] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const voiceRecognitionRef = useRef<any>(null);
  const voiceSilenceTimerRef = useRef<any>(null);

  const categories = [
    'All',
    'Fertilizer',
    'Pesticide',
    'Herbicide',
    'Fungicide',
    'Seed',
    'Organic',
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      prod.name.toLowerCase().includes(q) ||
      prod.brand.toLowerCase().includes(q) ||
      prod.activeIngredient.toLowerCase().includes(q) ||
      prod.punjabiName.toLowerCase().includes(q) ||
      prod.barcode.includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser.');
      return;
    }

    if (isListeningVoice) {
      if (voiceSilenceTimerRef.current) clearTimeout(voiceSilenceTimerRef.current);
      try {
        voiceRecognitionRef.current?.stop();
      } catch (e) {}
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'punjabi' ? 'pa-IN' : language === 'hindi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const text = processSpeechEvent(event);
        if (text) {
          setSearchQuery(text);
          if (voiceSilenceTimerRef.current) clearTimeout(voiceSilenceTimerRef.current);
          voiceSilenceTimerRef.current = setTimeout(() => {
            try {
              recognition.stop();
            } catch (e) {}
            setIsListeningVoice(false);
          }, 1400);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      voiceRecognitionRef.current = recognition;
      recognition.start();
      setIsListeningVoice(true);
    } catch (e) {
      console.warn('Voice search start error:', e);
      setIsListeningVoice(false);
    }
  };

  const simulateBarcodeScan = () => {
    setIsScanningBarcode(true);
    setTimeout(() => {
      // Pick a random product from list
      const randomProd = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
      setSearchQuery(randomProd.barcode);
      setIsScanningBarcode(false);
    }, 1800);
  };

  const submitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintForm),
      });
      setComplaintSubmitted(true);
      setTimeout(() => {
        setShowComplaintModal(false);
        setComplaintSubmitted(false);
        setComplaintForm({
          farmerName: '',
          phone: '',
          district: 'Ludhiana',
          dealerName: '',
          productName: '',
          mrp: '',
          chargedPrice: '',
          description: '',
        });
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-[#14532D] to-[#0a2f18] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Anti-Black Marketing & Fair Price Portal</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t.priceCheckerTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#EDEDD6] leading-relaxed">
              {t.priceCheckerSub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowComplaintModal(true)}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2.5"
          >
            <AlertOctagon className="w-5 h-5 text-amber-200" />
            <span>{t.reportOverpricing}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ਪ੍ਰੋਡਕਟ, ਬ੍ਰਾਂਡ, ਜਾਂ ਸਾਲਟ ਖੋਜੋ (e.g. Urea, Coragen, Tilt, DAP, 890123...)"
              className="w-full pl-11 pr-20 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D9B55] focus:bg-white text-gray-900"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleVoiceSearch}
                title={isListeningVoice ? 'ਰੋਕੋ (Listening...)' : 'ਬੋਲ ਕੇ ਖੋਜੋ (Voice Search)'}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isListeningVoice
                    ? 'bg-red-500 text-white animate-pulse shadow-md'
                    : 'text-gray-500 hover:text-[#14532D] hover:bg-gray-200'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={simulateBarcodeScan}
                title="ਬਾਰਕੋਡ ਸਕੈਨਰ (Scan Barcode)"
                className="p-2 rounded-xl text-gray-500 hover:text-[#14532D] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Barcode className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barcode scanner action feedback */}
          {isScanningBarcode && (
            <div className="w-full sm:w-auto px-4 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
              <Camera className="w-4 h-4 animate-spin" />
              <span>ਬਾਰਕੋਡ ਸਕੈਨ ਹੋ ਰਿਹਾ ਹੈ (Scanning Barcode)...</span>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#14532D] text-[#EABF48] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'ਸਾਰੇ (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          // Toxicity badge colors
          const toxBadgeColor =
            prod.toxicity === 'Green'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : prod.toxicity === 'Blue'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : prod.toxicity === 'Yellow'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-red-100 text-red-800 border-red-300';

          return (
            <motion.div
              key={prod.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-200/80 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image and Category Header */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#14532D]/90 text-white backdrop-blur-sm">
                    {prod.category}
                  </span>
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${toxBadgeColor}`}
                  >
                    {prod.toxicityLabel.split('(')[0]}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#14532D] line-clamp-1">{prod.name}</h3>
                    <p className="text-xs text-gray-500">{prod.brand} • {prod.manufacturer}</p>
                  </div>

                  {/* Active Ingredient */}
                  <div className="bg-[#F7F7E9] rounded-xl p-2.5 text-xs text-gray-700">
                    <p className="text-[10px] uppercase font-bold text-gray-500">ਮੁੱਖ ਸਾਲਟ (Active Ingredient):</p>
                    <p className="font-semibold text-[#14532D] line-clamp-1">{prod.activeIngredient}</p>
                  </div>

                  {/* Price Comparison Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500 line-through">MRP: ₹{prod.mrp.toFixed(2)}</p>
                      <p className="text-lg font-black text-[#14532D]">
                        ਵੈਰੀਫਾਈਡ: ₹{prod.verifiedDealerPrice.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">{prod.unitPrice}</p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#4D9B55] text-white">
                        {prod.packSize}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                        📍 {prod.dealerLocation.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  {/* PAU Recommended Dosage */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-700">ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਖੁਰਾਕ (Dosage):</p>
                    <p className="text-xs bg-gray-50 p-2 rounded-lg border border-gray-200 text-gray-800">
                      {prod.dosage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteProduct(prod);
                    setShowQuoteModal(true);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#14532D] text-xs font-bold transition-colors cursor-pointer"
                >
                  ਡੀਲਰ ਕੋਟੇਸ਼ਨ ਲਓ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComplaintForm((prev) => ({
                      ...prev,
                      productName: prod.name,
                      mrp: prod.mrp.toString(),
                    }));
                    setShowComplaintModal(true);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                >
                  ਵੱਧ ਰੇਟ ਸ਼ਿਕਾਇਤ
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
          <Tag className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">ਕੋਈ ਪ੍ਰੋਡਕਟ ਨਹੀਂ ਮਿਲਿਆ</h3>
          <p className="text-xs text-gray-500">ਖੋਜ ਸ਼ਬਦ ਬਦਲ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।</p>
        </div>
      )}

      {/* OVERPRICING COMPLAINT MODAL */}
      <AnimatePresence>
        {showComplaintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      ਕਾਲਾਬਾਜ਼ਾਰੀ / ਵੱਧ ਰੇਟ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ
                    </h3>
                    <p className="text-xs text-gray-500">Report Overcharging or Tied Selling</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {complaintSubmitted ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-base text-emerald-900">
                    ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ ਹੈ!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ (ADO) ਅਤੇ ਖਾਦ ਕੰਟਰੋਲਰ ਇਸਦੀ ਜਾਂਚ ਕਰਨਗੇ।
                  </p>
                </div>
              ) : (
                <form onSubmit={submitComplaint} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਕਿਸਾਨ ਦਾ ਨਾਂ (Farmer Name)</label>
                    <input
                      type="text"
                      required
                      value={complaintForm.farmerName}
                      onChange={(e) => setComplaintForm({ ...complaintForm, farmerName: e.target.value })}
                      placeholder="ਜਿਵੇਂ: ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਮੋਬਾਇਲ ਨੰਬਰ (Phone)</label>
                      <input
                        type="tel"
                        required
                        value={complaintForm.phone}
                        onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
                        placeholder="98765-XXXXX"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਜ਼ਿਲ੍ਹਾ (District)</label>
                      <input
                        type="text"
                        required
                        value={complaintForm.district}
                        onChange={(e) => setComplaintForm({ ...complaintForm, district: e.target.value })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਡੀਲਰ / ਦੁਕਾਨ ਦਾ ਨਾਂ ਅਤੇ ਸ਼ਹਿਰ</label>
                    <input
                      type="text"
                      required
                      value={complaintForm.dealerName}
                      onChange={(e) => setComplaintForm({ ...complaintForm, dealerName: e.target.value })}
                      placeholder="ਜਿਵੇਂ: ਕਿਸਾਨ ਐਗਰੋ ਸਟੋਰ, ਖੰਨਾ ਮੰਡੀ"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਪ੍ਰੋਡਕਟ ਦਾ ਨਾਂ</label>
                    <input
                      type="text"
                      required
                      value={complaintForm.productName}
                      onChange={(e) => setComplaintForm({ ...complaintForm, productName: e.target.value })}
                      placeholder="e.g. Urea 45kg bag"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਅਸਲ MRP (₹)</label>
                      <input
                        type="number"
                        value={complaintForm.mrp}
                        onChange={(e) => setComplaintForm({ ...complaintForm, mrp: e.target.value })}
                        placeholder="266.50"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਡੀਲਰ ਵੱਲੋਂ ਲਿਆ ਰੇਟ (₹)</label>
                      <input
                        type="number"
                        required
                        value={complaintForm.chargedPrice}
                        onChange={(e) => setComplaintForm({ ...complaintForm, chargedPrice: e.target.value })}
                        placeholder="350.00"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm text-red-600 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਵੇਰਵਾ (ਕੀ ਜਬਰੀ ਹੋਰ ਦਵਾਈ ਨਾਲ ਲਗਾਈ?)</label>
                    <textarea
                      rows={2}
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                      placeholder="ਡੀਲਰ ਨੇ ਯੂਰੀਆ ਨਾਲ ਜ਼ਬਰਦਸਤੀ ₹400 ਵਾਲੀ ਬੋਤਲ ਲਗਾ ਕੇ ਦਿੱਤੀ..."
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold text-sm shadow hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ (Submit Complaint)</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEALER QUOTATION REQUEST MODAL */}
      <AnimatePresence>
        {showQuoteModal && quoteProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#14532D] flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">
                      ਅਧਿਕਾਰਤ ਡੀਲਰਾਂ ਤੋਂ ਕੋਟੇਸ਼ਨ ਲਓ
                    </h3>
                    <p className="text-xs text-gray-500">{quoteProduct.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSuccess(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quoteSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-base text-emerald-900">
                    ਨੇੜਲੇ 3 ਡੀਲਰਾਂ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    ਉਹ 10 ਮਿੰਟਾਂ ਵਿੱਚ ਤੁਹਾਨੂੰ ਵਧੀਆ ਡਿਸਕਾਊਂਟ ਰੇਟ ਅਤੇ ਸਟਾਕ ਦੀ ਜਾਣਕਾਰੀ ਦੇਣਗੇ।
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <p className="text-gray-600">
                    ਤੁਹਾਡੇ ਨੇੜੇ (ਖੰਨਾ, ਲੁਧਿਆਣਾ ਅਤੇ ਬਠਿੰਡਾ) ਦੇ ਪ੍ਰਮਾਣਿਤ ਖਾਦ-ਬੀਜ ਸਟੋਰਾਂ ਤੋਂ ਸਿੱਧਾ ਵਧੀਆ ਰੇਟ ਪ੍ਰਾਪਤ ਕਰੋ:
                  </p>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ਪ੍ਰੋਡਕਟ:</span>
                      <strong className="text-gray-900">{quoteProduct.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ਸਰਕਾਰੀ ਰੇਟ:</span>
                      <strong className="text-emerald-700">₹{quoteProduct.verifiedDealerPrice}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ਪੈਕਿੰਗ:</span>
                      <span>{quoteProduct.packSize}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਲੋੜੀਂਦੀ ਮਾਤਰਾ (Quantity)</label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਆਪਣਾ ਮੋਬਾਇਲ ਨੰਬਰ</label>
                    <input
                      type="tel"
                      placeholder="98765-XXXXX"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuoteSuccess(true)}
                    className="w-full py-3 rounded-2xl bg-[#14532D] text-[#EABF48] font-bold text-sm shadow hover:bg-[#0a2f18] transition-colors cursor-pointer"
                  >
                    ਡੀਲਰ ਕੋਟੇਸ਼ਨ ਬੇਨਤੀ ਭੇਜੋ
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

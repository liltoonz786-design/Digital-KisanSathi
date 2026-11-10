import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  Save,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FarmingCalculatorsPageProps {
  language: Language;
}

interface CropConfig {
  name: string;
  punjabiName: string;
  defaultSeedCostPerAcre: number;
  defaultFertilizerCostPerAcre: number;
  defaultMachineryCostPerAcre: number;
  defaultLabourCostPerAcre: number;
  defaultIrrigationCostPerAcre: number;
  defaultSprayCostPerAcre: number;
  defaultOtherCostPerAcre: number;
  avgYieldQuintalsPerAcre: number;
  expectedPricePerQuintal: number; // Current MSP or prevailing market price
}

const CROP_CONFIGS: Record<string, CropConfig> = {
  Wheat: {
    name: 'Wheat',
    punjabiName: 'ਕਣਕ (Wheat)',
    defaultSeedCostPerAcre: 1300,
    defaultFertilizerCostPerAcre: 3200,
    defaultMachineryCostPerAcre: 3500, // Super seeder + combine
    defaultLabourCostPerAcre: 1800,
    defaultIrrigationCostPerAcre: 1200,
    defaultSprayCostPerAcre: 1100,
    defaultOtherCostPerAcre: 600,
    avgYieldQuintalsPerAcre: 21,
    expectedPricePerQuintal: 2425, // MSP 2026
  },
  Paddy: {
    name: 'Paddy / Basmati',
    punjabiName: 'ਝੋਨਾ / ਬਾਸਮਤੀ (Paddy)',
    defaultSeedCostPerAcre: 1100,
    defaultFertilizerCostPerAcre: 3800,
    defaultMachineryCostPerAcre: 4800, // Kaddu puddling + combine
    defaultLabourCostPerAcre: 4200, // Manual transplanting
    defaultIrrigationCostPerAcre: 3500,
    defaultSprayCostPerAcre: 2200,
    defaultOtherCostPerAcre: 900,
    avgYieldQuintalsPerAcre: 28,
    expectedPricePerQuintal: 2320, // Baseline MSP
  },
  Mustard: {
    name: 'Mustard',
    punjabiName: 'ਸਰ੍ਹੋਂ (Mustard)',
    defaultSeedCostPerAcre: 900,
    defaultFertilizerCostPerAcre: 2400,
    defaultMachineryCostPerAcre: 2200,
    defaultLabourCostPerAcre: 1500,
    defaultIrrigationCostPerAcre: 900,
    defaultSprayCostPerAcre: 800,
    defaultOtherCostPerAcre: 500,
    avgYieldQuintalsPerAcre: 8.5,
    expectedPricePerQuintal: 5650, // MSP
  },
  Cotton: {
    name: 'Cotton',
    punjabiName: 'ਨਰਮਾ / ਕਪਾਹ (Cotton)',
    defaultSeedCostPerAcre: 1800,
    defaultFertilizerCostPerAcre: 3900,
    defaultMachineryCostPerAcre: 3200,
    defaultLabourCostPerAcre: 6500, // Picking labour
    defaultIrrigationCostPerAcre: 2400,
    defaultSprayCostPerAcre: 3800, // Pink bollworm / whitefly sprays
    defaultOtherCostPerAcre: 1000,
    avgYieldQuintalsPerAcre: 9.5,
    expectedPricePerQuintal: 7121, // MSP
  },
  Maize: {
    name: 'Maize',
    punjabiName: 'ਮੱਕੀ (Maize)',
    defaultSeedCostPerAcre: 2200,
    defaultFertilizerCostPerAcre: 3400,
    defaultMachineryCostPerAcre: 3000,
    defaultLabourCostPerAcre: 2100,
    defaultIrrigationCostPerAcre: 1600,
    defaultSprayCostPerAcre: 1200,
    defaultOtherCostPerAcre: 600,
    avgYieldQuintalsPerAcre: 24,
    expectedPricePerQuintal: 2225, // MSP
  },
};

export const FarmingCalculatorsPage: React.FC<FarmingCalculatorsPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedCropKey, setSelectedCropKey] = useState<string>('Wheat');
  const cropConfig = CROP_CONFIGS[selectedCropKey];

  // User input states (per-acre rates)
  const [acres, setAcres] = useState<number>(5);
  const [seedCost, setSeedCost] = useState<number>(cropConfig.defaultSeedCostPerAcre);
  const [fertilizerCost, setFertilizerCost] = useState<number>(cropConfig.defaultFertilizerCostPerAcre);
  const [machineryCost, setMachineryCost] = useState<number>(cropConfig.defaultMachineryCostPerAcre);
  const [labourCost, setLabourCost] = useState<number>(cropConfig.defaultLabourCostPerAcre);
  const [irrigationCost, setIrrigationCost] = useState<number>(cropConfig.defaultIrrigationCostPerAcre);
  const [sprayCost, setSprayCost] = useState<number>(cropConfig.defaultSprayCostPerAcre);
  const [otherCost, setOtherCost] = useState<number>(cropConfig.defaultOtherCostPerAcre);
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(cropConfig.avgYieldQuintalsPerAcre);
  const [sellingPricePerQuintal, setSellingPricePerQuintal] = useState<number>(cropConfig.expectedPricePerQuintal);

  // Saved calculations list
  const [savedList, setSavedList] = useState<any[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync defaults when crop is switched
  useEffect(() => {
    const cfg = CROP_CONFIGS[selectedCropKey];
    setSeedCost(cfg.defaultSeedCostPerAcre);
    setFertilizerCost(cfg.defaultFertilizerCostPerAcre);
    setMachineryCost(cfg.defaultMachineryCostPerAcre);
    setLabourCost(cfg.defaultLabourCostPerAcre);
    setIrrigationCost(cfg.defaultIrrigationCostPerAcre);
    setSprayCost(cfg.defaultSprayCostPerAcre);
    setOtherCost(cfg.defaultOtherCostPerAcre);
    setExpectedYieldPerAcre(cfg.avgYieldQuintalsPerAcre);
    setSellingPricePerQuintal(cfg.expectedPricePerQuintal);
  }, [selectedCropKey]);

  // Load saved calculations
  useEffect(() => {
    fetch('/api/calculations')
      .then((res) => res.json())
      .then((data) => {
        if (data.calculations) setSavedList(data.calculations);
      })
      .catch((err) => console.error(err));
  }, []);

  // Financial Calculations
  const costPerAcre =
    seedCost + fertilizerCost + machineryCost + labourCost + irrigationCost + sprayCost + otherCost;
  const totalCost = costPerAcre * acres;
  const totalYieldQuintals = expectedYieldPerAcre * acres;
  const totalGrossRevenue = totalYieldQuintals * sellingPricePerQuintal;
  const netProfit = totalGrossRevenue - totalCost;
  const netProfitPerAcre = netProfit / (acres || 1);
  const breakEvenPrice = totalCost / (totalYieldQuintals || 1);
  const roiPercent = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(1) : '0';

  const handleSaveCalculation = async () => {
    try {
      const payload = {
        farmerName: 'Kisan Veer Ji',
        crop: cropConfig.punjabiName,
        acres,
        totalCost,
        expectedYieldQuintals: totalYieldQuintals,
        expectedRevenue: totalGrossRevenue,
        netProfit,
        costPerAcre,
      };

      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSavedList((prev) => [data.calculation, ...prev]);
        setSaveSuccessMsg('ਗਣਨਾ ਸੁਰੱਖਿਅਤ ਹੋ ਗਈ ਹੈ! (Saved Successfully)');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#1d7240] to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
            <Calculator className="w-3.5 h-3.5" />
            <span>PAU Cost of Cultivation Standards</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.calculatorsTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#EDEDD6] leading-relaxed">
            {t.calculatorsSub}
          </p>
        </div>
      </div>

      {/* Crop Preset Selector */}
      <div className="bg-white rounded-3xl p-4 shadow-md border border-gray-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {Object.keys(CROP_CONFIGS).map((cKey) => {
          const c = CROP_CONFIGS[cKey];
          return (
            <button
              key={cKey}
              type="button"
              onClick={() => setSelectedCropKey(cKey)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCropKey === cKey
                  ? 'bg-[#14532D] text-[#EABF48] shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.punjabiName}
            </button>
          );
        })}
      </div>

      {/* Main 2-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Dynamic Input Form with Sliders */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-200/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-[#14532D]">
              ਖੇਤੀਬਾੜੀ ਲਾਗਤ ਇਨਪੁਟ (Cost Inputs per Acre)
            </h3>
            <span className="text-xs text-gray-500 font-semibold">
              ਫਸਲ: {cropConfig.punjabiName}
            </span>
          </div>

          {/* Acreage Slider */}
          <div className="space-y-2 bg-[#F7F7E9] p-4 rounded-2xl border border-[#14532D]/10">
            <div className="flex justify-between items-center text-xs font-bold text-[#14532D]">
              <span>ਕੁੱਲ ਰਕਬਾ (Total Land Area):</span>
              <span className="text-base text-emerald-800 font-black">{acres} ਏਕੜ (Acres)</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              className="w-full accent-[#14532D] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>1 Acre</span>
              <span>25 Acres</span>
              <span>50 Acres</span>
            </div>
          </div>

          {/* Detailed Input Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Seed Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਬੀਜ ਖਰਚਾ (Seed Cost):</span>
                <span className="text-[#14532D] font-bold">₹{seedCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={seedCost}
                onChange={(e) => setSeedCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>

            {/* Fertilizer Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਖਾਦਾਂ (DAP, Urea, Zinc):</span>
                <span className="text-[#14532D] font-bold">₹{fertilizerCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>

            {/* Machinery Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਟਰੈਕਟਰ / ਮਸ਼ੀਨਰੀ ਕਿਰਾਇਆ:</span>
                <span className="text-[#14532D] font-bold">₹{machineryCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={machineryCost}
                onChange={(e) => setMachineryCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>

            {/* Labour Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਮਜ਼ਦੂਰੀ (Labour / Weeding):</span>
                <span className="text-[#14532D] font-bold">₹{labourCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={labourCost}
                onChange={(e) => setLabourCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>

            {/* Irrigation Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਸਿੰਚਾਈ / ਡੀਜ਼ਲ ਖਰਚਾ:</span>
                <span className="text-[#14532D] font-bold">₹{irrigationCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={irrigationCost}
                onChange={(e) => setIrrigationCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>

            {/* Sprays Cost */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
              <label className="font-bold text-gray-700 flex justify-between">
                <span>ਕੀਟਨਾਸ਼ਕ ਤੇ ਨਦੀਨ ਨਾਸ਼ਕ:</span>
                <span className="text-[#14532D] font-bold">₹{sprayCost}/ਏਕੜ</span>
              </label>
              <input
                type="number"
                value={sprayCost}
                onChange={(e) => setSprayCost(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-semibold text-gray-900"
              />
            </div>
          </div>

          {/* Revenue Expectations Row */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
            <h4 className="font-bold text-emerald-950 uppercase tracking-wider">
              ਉਮੀਦਤ ਝਾੜ ਅਤੇ ਮੰਡੀ ਭਾਅ (Expected Yield & Mandi Price)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  ਅੰਦਾਜ਼ਨ ਝਾੜ (Yield Qtl/Acre):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={expectedYieldPerAcre}
                  onChange={(e) => setExpectedYieldPerAcre(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  ਵੇਚ ਮੁੱਲ (Price ₹/Quintal - MSP):
                </label>
                <input
                  type="number"
                  value={sellingPricePerQuintal}
                  onChange={(e) => setSellingPricePerQuintal(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-bold text-[#14532D]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Animated Results & Transparency Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#14532D] to-[#0a2f18] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EABF48]/30 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div>
                <span className="text-xs text-[#EABF48] font-bold uppercase">
                  ਵਿੱਤੀ ਨਤੀਜਾ ({acres} ਏਕੜ)
                </span>
                <h3 className="text-xl font-black text-white">{cropConfig.punjabiName}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  netProfit >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {netProfit >= 0 ? 'ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ (Profit)' : 'ਨੁਕਸਾਨ (Loss)'}
              </span>
            </div>

            {/* Big Net Profit Display */}
            <div className="text-center py-2">
              <span className="text-xs text-emerald-200 uppercase font-semibold">
                ਕੁੱਲ ਸ਼ੁੱਧ ਬੱਚਤ (Estimated Net Profit)
              </span>
              <p
                className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-1 ${
                  netProfit >= 0 ? 'text-[#EABF48]' : 'text-red-400'
                }`}
              >
                ₹{Math.round(netProfit).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-white/70 mt-1">
                ਪ੍ਰਤੀ ਏਕੜ ਮੁਨਾਫ਼ਾ: <strong>₹{Math.round(netProfitPerAcre).toLocaleString('en-IN')}</strong> | ROI: <strong>{roiPercent}%</strong>
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                <span className="text-white/60">ਕੁੱਲ ਖਰਚਾ (Investment):</span>
                <p className="text-lg font-bold text-white mt-0.5">
                  ₹{Math.round(totalCost).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-white/50">₹{Math.round(costPerAcre)} / ਏਕੜ</span>
              </div>

              <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                <span className="text-white/60">ਕੁੱਲ ਵਿਕਰੀ (Revenue):</span>
                <p className="text-lg font-bold text-emerald-300 mt-0.5">
                  ₹{Math.round(totalGrossRevenue).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-white/50">{totalYieldQuintals.toFixed(1)} ਕੁਇੰਟਲ ਝਾੜ</span>
              </div>
            </div>

            {/* Break-even calculation formula */}
            <div className="bg-black/20 rounded-2xl p-3.5 border border-white/10 text-xs text-white/80 space-y-1">
              <div className="flex justify-between items-center text-[#EABF48] font-bold">
                <span>ਬਰੇਕ-ਈਵਨ ਰੇਟ (Break-Even MSP):</span>
                <span className="text-sm">₹{Math.round(breakEvenPrice)} / ਕੁਇੰਟਲ</span>
              </div>
              <p className="text-[11px] text-white/60">
                (ਜੇਕਰ ਫਸਲ ₹{Math.round(breakEvenPrice)} ਤੋਂ ਵੱਧ ਵਿਕਦੀ ਹੈ ਤਾਂ ਤੁਹਾਨੂੰ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ ਹੋਵੇਗਾ)
              </p>
            </div>

            {/* Action: Save & Print */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveCalculation}
                className="flex-1 py-3 rounded-2xl bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D] font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>ਹਿਸਾਬ ਸੇਵ ਕਰੋ (Save Calculation)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>ਪ੍ਰਿੰਟ / PDF</span>
              </button>
            </div>

            {saveSuccessMsg && (
              <p className="text-xs text-center text-emerald-300 font-bold animate-fadeIn">
                ✓ {saveSuccessMsg}
              </p>
            )}
          </motion.div>

          {/* Transparent Formulas Explanation Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-3 text-xs text-gray-600">
            <h4 className="font-extrabold text-[#14532D] flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-[#4D9B55]" />
              <span>ਪਾਰਦਰਸ਼ੀ ਫਾਰਮੂਲੇ (Transparent Formulas)</span>
            </h4>
            <ul className="space-y-1.5">
              <li>• <strong>ਕੁੱਲ ਲਾਗਤ =</strong> (ਬੀਜ + ਖਾਦ + ਮਸ਼ੀਨਰੀ + ਮਜ਼ਦੂਰੀ + ਪਾਣੀ + ਸਪਰੇਅ) × ਏਕੜ</li>
              <li>• <strong>ਕੁੱਲ ਆਮਦਨ =</strong> (ਏਕੜ × ਔਸਤ ਝਾੜ ਕੁਇੰਟਲ) × ਮੰਡੀ ਭਾਅ</li>
              <li>• <strong>ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ =</strong> ਕੁੱਲ ਆਮਦਨ - ਕੁੱਲ ਖਰਚਾ</li>
              <li>• <strong>ਬਰੇਕ-ਈਵਨ ਮੁੱਲ =</strong> ਕੁੱਲ ਖਰਚਾ ÷ ਕੁੱਲ ਕੁਇੰਟਲ ਝਾੜ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Saved Calculations History */}
      {savedList.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#14532D]">
              ਤੁਹਾਡੇ ਪਿਛਲੇ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਹਿਸਾਬ-ਕਿਤਾਬ (Saved Calculations)
            </h3>
            <span className="text-xs text-gray-500">{savedList.length} ਰਿਕਾਰਡ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedList.map((item) => (
              <div
                key={item.id}
                className="bg-[#F7F7E9] p-4 rounded-2xl border border-[#14532D]/10 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#14532D] text-sm">{item.crop}</span>
                  <span className="text-gray-500 text-[10px]">{item.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ਰਕਬਾ:</span>
                  <strong>{item.acres} ਏਕੜ</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ਕੁੱਲ ਖਰਚਾ:</span>
                  <span>₹{Math.round(item.totalCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-700 font-bold">ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ:</span>
                  <strong className="text-emerald-700 font-extrabold">
                    ₹{Math.round(item.netProfit).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

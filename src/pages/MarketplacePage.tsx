import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tractor,
  PhoneCall,
  MapPin,
  Tag,
  Plus,
  CheckCircle,
  Filter,
  Search,
  X,
  Upload,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { PUNJAB_DISTRICTS } from '../data/mockData';

interface MarketplacePageProps {
  language: Language;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  // Add Listing Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Tractor',
    brand: 'John Deere',
    modelYear: 2024,
    hp: 55,
    action: 'Rent',
    price: 1200,
    priceUnit: 'per acre',
    ownerName: '',
    phone: '',
    village: '',
    district: 'Ludhiana',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
  });

  const machineryTypes = [
    'All',
    'Tractor',
    'Super Seeder',
    'Rotavator',
    'Combine',
    'Laser Leveller',
    'Trolley',
  ];

  const fetchItems = () => {
    setLoading(true);
    let url = '/api/marketplace?';
    if (selectedType !== 'All') url += `type=${selectedType}&`;
    if (selectedAction !== 'All') url += `action=${selectedAction}&`;
    if (selectedDistrict !== 'All') url += `district=${selectedDistrict}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setItems(data.items);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [selectedType, selectedAction, selectedDistrict]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        fetchItems();
        setTimeout(() => {
          setShowAddModal(false);
          setFormSuccess(false);
          setForm({
            title: '',
            type: 'Tractor',
            brand: 'John Deere',
            modelYear: 2024,
            hp: 55,
            action: 'Rent',
            price: 1200,
            priceUnit: 'per acre',
            ownerName: '',
            phone: '',
            village: '',
            district: 'Ludhiana',
            description: '',
            imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
          });
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to post machinery');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-[#14532D] to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              <Tractor className="w-3.5 h-3.5" />
              <span>Punjab Agri Machinery Exchange</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ਟਰੈਕਟਰ ਅਤੇ ਖੇਤੀ ਸੰਦ ਮਾਰਕੀਟ
            </h1>
            <p className="text-sm sm:text-base text-[#EDEDD6] leading-relaxed">
              ਕਿਰਾਏ 'ਤੇ ਲਓ, ਖਰੀਦੋ ਜਾਂ ਵੇਚੋ – ਸੁਪਰ ਸੀਡਰ, ਟਰੈਕਟਰ, ਰੋਟਾਵੇਟਰ, ਲੇਜ਼ਰ ਕਰਾਹ ਅਤੇ ਕੰਬਾਈਨ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3.5 rounded-2xl bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D] font-extrabold text-xs sm:text-sm shadow-xl transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>ਆਪਣਾ ਸੰਦ ਪੋਸਟ ਕਰੋ (Add Listing)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-200/80 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Action Tabs: All / Rent / Sale */}
          <div className="inline-flex rounded-2xl p-1 bg-gray-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedAction('All')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedAction === 'All' ? 'bg-[#14532D] text-[#EABF48] shadow-sm' : 'text-gray-600'
              }`}
            >
              ਸਾਰੇ (All)
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction('Rent')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedAction === 'Rent' ? 'bg-[#14532D] text-[#EABF48] shadow-sm' : 'text-gray-600'
              }`}
            >
              ਕਿਰਾਏ 'ਤੇ (For Rent)
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction('Sale')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedAction === 'Sale' ? 'bg-[#14532D] text-[#EABF48] shadow-sm' : 'text-gray-600'
              }`}
            >
              ਵਿਕਰੀ ਲਈ (For Sale)
            </button>
          </div>

          {/* District selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-50 border rounded-2xl py-2 px-3 text-xs font-semibold text-gray-800 outline-none cursor-pointer"
          >
            <option value="All">ਸਾਰੇ ਜ਼ਿਲ੍ਹੇ (All Districts)</option>
            {PUNJAB_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Machinery Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {machineryTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedType === t
                  ? 'bg-[#4D9B55] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Machinery Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -3 }}
            className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-200/80 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold text-white backdrop-blur-sm ${
                    m.action === 'Rent' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                >
                  {m.action === 'Rent' ? 'ਕਿਰਾਏ ਉਪਲਬਧ' : 'ਵਿਕਾਊ (For Sale)'}
                </span>

                {m.hp && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-black bg-[#EABF48] text-[#14532D]">
                    {m.hp} HP
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {m.type} • ਮਾਡਲ {m.modelYear}
                  </span>
                  {m.verified && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ਵੈਰੀਫਾਈਡ
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-[#14532D] leading-snug">{m.title}</h3>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{m.description}</p>

                <div className="p-3 bg-[#F7F7E9] rounded-2xl border border-[#14532D]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block">ਰੇਟ / ਕੀਮਤ:</span>
                    <strong className="text-lg font-black text-[#14532D]">
                      ₹{m.price.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[11px] text-gray-600 ml-1">/{m.priceUnit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">ਮਾਲਕ:</span>
                    <span className="text-xs font-bold text-gray-800">{m.ownerName}</span>
                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-0.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#4D9B55]" />
                      {m.village}, {m.district}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={`tel:${m.phone}`}
                className="w-full py-3 rounded-2xl bg-[#14532D] hover:bg-[#0a2f18] text-[#EABF48] font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>ਮਾਲਕ ਨਾਲ ਗੱਲ ਕਰੋ ({m.phone})</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-500 space-y-2">
          <Tractor className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-sm font-bold">ਕੋਈ ਮਸ਼ੀਨਰੀ ਨਹੀਂ ਮਿਲੀ। ਨਵੀਂ ਪੋਸਟਿੰਗ ਕਰੋ!</p>
        </div>
      )}

      {/* Add Machinery Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#14532D] flex items-center justify-center">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">ਆਪਣਾ ਸੰਦ ਪੋਸਟ ਕਰੋ</h3>
                    <p className="text-xs text-gray-500">Post Tractor or Equipment for Rent / Sale</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-base text-emerald-900">
                    ਤੁਹਾਡੀ ਪੋਸਟਿੰਗ ਲਾਈਵ ਹੋ ਗਈ ਹੈ!
                  </h4>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਸਿਰਲੇਖ (Title)</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Swaraj 855 FE with Super Seeder"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਕਿਸਮ (Type)</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      >
                        <option value="Tractor">Tractor</option>
                        <option value="Super Seeder">Super Seeder</option>
                        <option value="Rotavator">Rotavator</option>
                        <option value="Combine">Combine</option>
                        <option value="Laser Leveller">Laser Leveller</option>
                        <option value="Trolley">Trolley</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਕਿਰਾਇਆ ਜਾਂ ਵਿਕਰੀ</label>
                      <select
                        value={form.action}
                        onChange={(e) => setForm({ ...form, action: e.target.value as any })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      >
                        <option value="Rent">ਕਿਰਾਏ ਉੱਤੇ (Rent)</option>
                        <option value="Sale">ਵੇਚਣਾ ਹੈ (Sale)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਰੇਟ / ਕੀਮਤ (₹)</label>
                      <input
                        type="number"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm font-bold text-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਰੇਟ ਇਕਾਈ (Price Unit)</label>
                      <select
                        value={form.priceUnit}
                        onChange={(e) => setForm({ ...form, priceUnit: e.target.value as any })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      >
                        <option value="per acre">ਪ੍ਰਤੀ ਏਕੜ (per acre)</option>
                        <option value="per hour">ਪ੍ਰਤੀ ਘੰਟਾ (per hour)</option>
                        <option value="per day">ਪ੍ਰਤੀ ਦਿਨ (per day)</option>
                        <option value="total">ਕੁੱਲ ਕੀਮਤ (total)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਮਾਲਕ ਦਾ ਨਾਂ</label>
                      <input
                        type="text"
                        required
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        placeholder="ਸੁਖਦੇਵ ਸਿੰਘ"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਫ਼ੋਨ ਨੰਬਰ</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="98765-XXXXX"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਪਿੰਡ (Village)</label>
                      <input
                        type="text"
                        required
                        value={form.village}
                        onChange={(e) => setForm({ ...form, village: e.target.value })}
                        placeholder="ਰਾਏਕੋਟ"
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">ਜ਼ਿਲ੍ਹਾ (District)</label>
                      <select
                        value={form.district}
                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                      >
                        {PUNJAB_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਵੇਰਵਾ (Description)</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="ਟਾਇਰ ਨਵੇਂ ਹਨ, ਡੀਜ਼ਲ ਔਸਤ ਬਹੁਤ ਵਧੀਆ ਹੈ..."
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#14532D] text-[#EABF48] font-bold text-sm shadow hover:bg-[#0a2f18] transition-colors cursor-pointer"
                  >
                    ਸੰਦ ਲਾਈਵ ਪੋਸਟ ਕਰੋ
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

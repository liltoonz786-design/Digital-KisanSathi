import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Tag,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface ExpenseEntry {
  id: string;
  date: string;
  category: 'Seeds' | 'Fertilizer' | 'Diesel' | 'Labour' | 'Pesticide' | 'Machinery' | 'Other' | 'Crop Sale (Income)';
  description: string;
  amount: number;
  type: 'Expense' | 'Income';
  crop: string;
}

interface ExpenseDiaryPageProps {
  language: Language;
}

export const ExpenseDiaryPage: React.FC<ExpenseDiaryPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const defaultEntries: ExpenseEntry[] = [
    {
      id: 'e-1',
      date: '2026-11-01',
      category: 'Seeds',
      description: 'PAU PBW-826 4 bags (160 kg) seed',
      amount: 4800,
      type: 'Expense',
      crop: 'Wheat (ਕਣਕ)',
    },
    {
      id: 'e-2',
      date: '2026-11-02',
      category: 'Fertilizer',
      description: 'DAP 5 bags @ ₹1,350 from Cooperative Society',
      amount: 6750,
      type: 'Expense',
      crop: 'Wheat (ਕਣਕ)',
    },
    {
      id: 'e-3',
      date: '2026-11-03',
      category: 'Machinery',
      description: 'Super Seeder sowing 4 acres @ ₹1,200',
      amount: 4800,
      type: 'Expense',
      crop: 'Wheat (ਕਣਕ)',
    },
    {
      id: 'e-4',
      date: '2026-10-25',
      category: 'Crop Sale (Income)',
      description: 'Pusa 1509 Basmati sold at Rajpura Mandi (65 quintals)',
      amount: 234000,
      type: 'Income',
      crop: 'Basmati Paddy',
    },
  ];

  const [entries, setEntries] = useState<ExpenseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_diary_entries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return defaultEntries;
  });

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Fertilizer' as any,
    description: '',
    amount: '',
    type: 'Expense' as any,
    crop: 'Wheat (ਕਣਕ)',
  });

  useEffect(() => {
    try {
      localStorage.setItem('kisan_diary_entries', JSON.stringify(entries));
    } catch (e) {
      // ignore
    }
  }, [entries]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    const newEntry: ExpenseEntry = {
      id: `diary-${Date.now()}`,
      date: form.date,
      category: form.category,
      description: form.description,
      amount: Number(form.amount) || 0,
      type: form.type,
      crop: form.crop,
    };

    setEntries([newEntry, ...entries]);
    setShowAddForm(false);
    setForm({
      date: new Date().toISOString().split('T')[0],
      category: 'Fertilizer',
      description: '',
      amount: '',
      type: 'Expense',
      crop: 'Wheat (ਕਣਕ)',
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((item) => item.id !== id));
  };

  const totalExpense = entries
    .filter((e) => e.type === 'Expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = entries
    .filter((e) => e.type === 'Income')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-[#14532D] to-[#0a2f18] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ਖੇਤੀਬਾੜੀ ਖਰਚਾ-ਆਮਦਨ ਡਾਇਰੀ</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ਕਿਸਾਨ ਖਰਚਾ ਡਾਇਰੀ (Farm Expense Diary)
            </h1>
            <p className="text-xs sm:text-sm text-[#EDEDD6]">
              ਬੀਜ, ਖਾਦ, ਡੀਜ਼ਲ, ਸਪਰੇਅ ਅਤੇ ਮੰਡੀ ਵਿਕਰੀ ਦਾ ਸਾਰਾ ਰਿਕਾਰਡ ਇੱਕੋ ਥਾਂ ਸੁਰੱਖਿਅਤ ਰੱਖੋ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3.5 rounded-2xl bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D] font-extrabold text-xs sm:text-sm shadow-xl transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>ਨਵਾਂ ਖਰਚਾ / ਆਮਦਨ ਲਿਖੋ</span>
          </button>
        </div>
      </div>

      {/* Financial Summary 3-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-red-600 font-bold">
            <span>ਕੁੱਲ ਖਰਚਾ (Total Expense)</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{totalExpense.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-gray-500">ਹਾੜ੍ਹੀ/ਸੌਣੀ ਸੀਜ਼ਨ ਦੇ ਖਰਚੇ</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
            <span>ਕੁੱਲ ਆਮਦਨ (Total Income)</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-gray-500">ਮੰਡੀ ਫਸਲ ਵਿਕਰੀ ਰਕਮ</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#14532D] font-bold">
            <span>ਸ਼ੁੱਧ ਬੱਚਤ (Net Balance)</span>
            <DollarSign className="w-4 h-4 text-[#EABF48]" />
          </div>
          <p
            className={`text-2xl sm:text-3xl font-black ${
              netBalance >= 0 ? 'text-[#14532D]' : 'text-red-600'
            }`}
          >
            ₹{netBalance.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-gray-500">
            {netBalance >= 0 ? 'ਮੁਨਾਫ਼ੇ ਵਿੱਚ (Profitable)' : 'ਘਾਟਾ (Deficit)'}
          </span>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#4D9B55] space-y-4 text-xs"
        >
          <h3 className="font-extrabold text-base text-[#14532D]">
            ਡਾਇਰੀ ਵਿੱਚ ਨਵਾਂ ਇੰਦਰਾਜ ਦਰਜ ਕਰੋ
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">ਮਿਤੀ (Date)</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ਕਿਸਮ (Type)</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm font-bold text-[#14532D]"
                >
                  <option value="Expense">ਖਰਚਾ (Expense)</option>
                  <option value="Income">ਆਮਦਨ (Income)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ਕੈਟਾਗਰੀ (Category)</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                >
                  <option value="Seeds">ਬੀਜ (Seeds)</option>
                  <option value="Fertilizer">ਖਾਦ (Fertilizer - DAP/Urea)</option>
                  <option value="Diesel">ਡੀਜ਼ਲ / ਪਾਣੀ (Diesel)</option>
                  <option value="Labour">ਮਜ਼ਦੂਰੀ (Labour)</option>
                  <option value="Pesticide">ਸਪਰੇਅ / ਦਵਾਈ (Pesticide)</option>
                  <option value="Machinery">ਮਸ਼ੀਨਰੀ / ਟਰੈਕਟਰ (Machinery)</option>
                  <option value="Crop Sale (Income)">ਫਸਲ ਵਿਕਰੀ (Crop Sale)</option>
                  <option value="Other">ਹੋਰ (Other)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">ਵੇਰਵਾ (Description)</label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="ਜਿਵੇਂ: ਯੂਰੀਆ ਦੇ 4 ਗੱਟੇ ਸੁਸਾਇਟੀ ਤੋਂ ਲਏ..."
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ਰਕਮ (Amount ₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="1500"
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#14532D] text-[#EABF48] font-bold text-xs hover:bg-[#0a2f18] transition-colors cursor-pointer"
              >
                ਸੇਵ ਕਰੋ (Save Entry)
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                ਰੱਦ ਕਰੋ
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Diary Ledger Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-200/80">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#14532D]">ਖਰਚਾ-ਆਮਦਨ ਸੂਚੀ (Ledger Records)</h3>
          <span className="text-xs text-gray-500">{entries.length} ਐਂਟਰੀਆਂ</span>
        </div>

        <div className="divide-y divide-gray-100">
          {entries.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'Income'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">{item.description}</h4>
                <p className="text-[11px] text-gray-500">ਫਸਲ: {item.crop}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`text-base sm:text-lg font-black ${
                    item.type === 'Income' ? 'text-emerald-700' : 'text-gray-900'
                  }`}
                >
                  {item.type === 'Income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  title="ਹਟਾਓ (Delete)"
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

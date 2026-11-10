import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Users,
  Tag,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  EyeOff,
  Check,
  Building,
  Sparkles,
  Key,
  Lock,
  Unlock,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MOCK_PRODUCTS, MOCK_MANDI_RATES } from '../data/mockData';

interface AdminPanelPageProps {
  language: Language;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeAdminTab, setActiveAdminTab] = useState<'complaints' | 'products' | 'mandi' | 'gemini'>('complaints');
  const [adminRole, setAdminRole] = useState<'ADO (Agriculture Officer)' | 'Fertilizer Inspector' | 'Super Admin'>('ADO (Agriculture Officer)');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState<boolean>(true);

  // Gemini AI Admin Gateway State (Protected by 'kisaanhelp786')
  const [adminPassword, setAdminPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [geminiStatus, setGeminiStatus] = useState<{ connected: boolean; hasKey: boolean; maskedKey: string | null; model?: string } | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testPrompt, setTestPrompt] = useState('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਪੰਜਾਬ ਵਿੱਚ ਸਰਦੀਆਂ ਦੀਆਂ ਸਬਜ਼ੀਆਂ (ਆਲੂ, ਮਟਰ, ਗੋਭੀ) ਅਤੇ ਕਣਕ ਦੇ ਪਾਣੀ ਬਾਰੇ ਸਲਾਹ ਦਿਓ।');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; reply?: string; error?: string } | null>(null);

  const fetchComplaints = () => {
    setLoadingComplaints(true);
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        if (data.complaints) setComplaints(data.complaints);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingComplaints(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateComplaintStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGeminiStatus = async () => {
    try {
      const res = await fetch('/api/admin/gemini-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword || 'kisaanhelp786' }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeminiStatus(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim() === 'kisaanhelp786') {
      setIsUnlocked(true);
      setAuthError('');
      fetchGeminiStatus();
    } else {
      setAuthError('ਗ਼ਲਤ ਐਡਮਿਨ ਪਾਸਵਰਡ! ਸਿਰਫ਼ ਅਧਿਕਾਰਤ ਐਡਮਿਨ ਹੀ ਦਾਖ਼ਲ ਹੋ ਸਕਦਾ ਹੈ। (Secret password is kisaanhelp786)');
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    setKeySaveMessage(null);
    try {
      const res = await fetch('/api/admin/set-gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'kisaanhelp786', apiKey: apiKeyInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKeySaveMessage({ type: 'success', text: data.message });
        setApiKeyInput('');
        fetchGeminiStatus();
      } else {
        setKeySaveMessage({ type: 'error', text: data.error || 'ਕਨੈਕਸ਼ਨ ਅਸਫ਼ਲ ਰਿਹਾ' });
      }
    } catch (err: any) {
      setKeySaveMessage({ type: 'error', text: err?.message || 'ਨੈੱਟਵਰਕ ਸਮੱਸਿਆ' });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'kisaanhelp786', testPrompt }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, reply: data.reply });
      } else {
        setTestResult({ success: false, error: data.error || 'Gemini ਵੱਲੋਂ ਕੋਈ ਜਵਾਬ ਨਹੀਂ ਆਇਆ' });
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'ਕਨੈਕਸ਼ਨ ਗ਼ਲਤੀ' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#0a2f18] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Punjab Agriculture & Mandi Board Administrative Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ (Admin Command Centre)
            </h1>
            <p className="text-xs sm:text-sm text-[#EDEDD6]">
              ਖਾਦ ਕਾਲਾਬਾਜ਼ਾਰੀ ਸ਼ਿਕਾਇਤਾਂ ਦਾ ਨਿਪਟਾਰਾ, ਮੰਡੀ ਭਾਅ ਨਿਗਰਾਨੀ ਅਤੇ ਵੈਰੀਫਾਈਡ ਡੀਲਰ ਲਿਸਟ।
            </p>
          </div>

          {/* Role Switcher */}
          <div className="bg-white/10 rounded-2xl p-2 border border-white/20 shrink-0">
            <span className="text-[10px] text-white/70 block px-2 mb-1">ਸਰਕਾਰੀ ਅਹੁਦਾ (Active Role):</span>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as any)}
              className="bg-[#14532D] text-xs font-bold text-[#EABF48] rounded-xl px-3 py-2 border border-[#EABF48]/40 outline-none cursor-pointer"
            >
              <option value="ADO (Agriculture Officer)">ADO (Agriculture Development Officer)</option>
              <option value="Fertilizer Inspector">ਖਾਦ ਇੰਸਪੈਕਟਰ (Fertilizer Quality Controller)</option>
              <option value="Super Admin">ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਸੁਪਰ ਐਡਮਿਨ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveAdminTab('complaints')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'complaints'
              ? 'bg-[#14532D] text-[#EABF48] shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>ਵੱਧ ਰੇਟ ਸ਼ਿਕਾਇਤਾਂ ({complaints.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('products')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'products'
              ? 'bg-[#14532D] text-[#EABF48] shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>ਖਾਦ ਅਤੇ ਦਵਾਈਆਂ MRP ਰਜਿਸਟਰ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('mandi')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'mandi'
              ? 'bg-[#14532D] text-[#EABF48] shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>ਮੰਡੀ ਭਾਅ ਨਿਗਰਾਨੀ</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveAdminTab('gemini');
            if (isUnlocked) fetchGeminiStatus();
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'gemini'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#EABF48]" />
          <span>Gemini AI ਕੰਟਰੋਲ (Google Key)</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">🔒</span>
        </button>
      </div>

      {/* Tab 1: Overpricing Complaints */}
      {activeAdminTab === 'complaints' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-[#14532D]">
                ਕਿਸਾਨਾਂ ਵੱਲੋਂ ਦਰਜ ਕੀਤੀਆਂ ਗਈਆਂ ਸ਼ਿਕਾਇਤਾਂ (Farmer Overpricing Reports)
              </h3>
              <p className="text-xs text-gray-500">
                ਗੈਰ-ਕਾਨੂੰਨੀ ਵਾਧੂ ਰੇਟ ਵਸੂਲਣ ਵਾਲੇ ਡੀਲਰਾਂ ਦੀ ਸੂਚੀ
              </p>
            </div>
            <button
              type="button"
              onClick={fetchComplaints}
              className="text-xs font-bold text-[#14532D] hover:underline cursor-pointer"
            >
              ਰਿਫ੍ਰੈਸ਼ ਕਰੋ
            </button>
          </div>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/60 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-gray-200 text-gray-800">
                      {c.id}
                    </span>
                    <h4 className="font-extrabold text-sm text-gray-900">{c.productName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Investigating'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500">{c.date}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border">
                  <div>
                    <span className="text-gray-500 block">ਸ਼ਿਕਾਇਤਕਰਤਾ (Farmer):</span>
                    <strong className="text-gray-900">{c.farmerName} ({c.phone})</strong>
                    <p className="text-gray-500 text-[11px]">ਜ਼ਿਲ੍ਹਾ: {c.district}</p>
                  </div>

                  <div>
                    <span className="text-gray-500 block">ਦੋਸ਼ੀ ਡੀਲਰ / ਸਟੋਰ:</span>
                    <strong className="text-red-700">{c.dealerName}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 block">ਰੇਟ ਵਸੂਲੀ ਫ਼ਰਕ:</span>
                    <p className="text-gray-700">
                      ਸਰਕਾਰੀ MRP: <strong>₹{c.mrp}</strong> | ਵਸੂਲਿਆ: <strong className="text-red-600">₹{c.chargedPrice}</strong>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70">
                  <strong>ਵੇਰਵਾ:</strong> {c.description}
                </p>

                {/* Status action buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-500 text-[11px]">ਅਧਿਕਾਰੀ ਕਾਰਵਾਈ:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateComplaintStatus(c.id, 'Investigating')}
                      className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ (Investigating)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateComplaintStatus(c.id, 'Resolved')}
                      className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      ਹੱਲ ਹੋ ਗਿਆ (Mark Resolved)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Products MRP Register */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-[#14532D]">
              ਅਧਿਕਾਰਤ ਖਾਦ, ਕੀਟਨਾਸ਼ਕ ਅਤੇ ਬੀਜ ਰਜਿਸਟਰ (Govt MRP Register)
            </h3>
            <span className="text-xs text-gray-500">{MOCK_PRODUCTS.length} ਪ੍ਰਮਾਣਿਤ ਵਸਤਾਂ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F7E9] text-[#14532D] uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">ਪ੍ਰੋਡਕਟ ਦਾ ਨਾਂ</th>
                  <th className="p-3">ਕੈਟਾਗਰੀ</th>
                  <th className="p-3">ਬ੍ਰਾਂਡ / ਕੰਪਨੀ</th>
                  <th className="p-3">ਸਰਕਾਰੀ MRP</th>
                  <th className="p-3">ਡੀਲਰ ਰੇਟ</th>
                  <th className="p-3 rounded-r-xl">ਸਥਿਤੀ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 text-gray-600">{p.manufacturer}</td>
                    <td className="p-3 font-bold text-gray-900">₹{p.mrp.toFixed(2)}</td>
                    <td className="p-3 font-black text-emerald-700">₹{p.verifiedDealerPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ਵੈਰੀਫਾਈਡ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Mandi Live Feed Monitor */}
      {activeAdminTab === 'mandi' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-[#14532D]">
              ਪੰਜਾਬ ਮੰਡੀ ਬੋਰਡ ਅਧਿਕਾਰਤ ਨਿਗਰਾਨੀ (Mandi Live Feed)
            </h3>
            <span className="text-xs text-emerald-700 font-bold">● ਲਾਈਵ ਕੁਨੈਕਟਡ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_MANDI_RATES.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-gray-50 border space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <strong className="text-sm text-[#14532D]">{m.mandi}</strong>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {m.district}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold">{m.crop} ({m.variety})</p>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">ਮਾਡਲ ਰੇਟ:</span>
                  <strong className="text-base text-emerald-800">₹{m.modalPrice}/Qtl</strong>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>ਰੋਜ਼ਾਨਾ ਆਮਦ:</span>
                  <span>{m.arrivalQuantityQuintals.toLocaleString()} ਕੁਇੰਟਲ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Gemini AI Gateway & API Key Settings (Protected by 'kisaanhelp786') */}
      {activeAdminTab === 'gemini' && (
        <div className="space-y-6">
          {!isUnlocked ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-amber-200/80 max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#14532D]">
                  ਸੁਰੱਖਿਅਤ ਐਡਮਿਨ ਗੇਟਵੇਅ (Admin Security Gateway)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  ਇਹ ਸੈਟਿੰਗ ਸਿਰਫ਼ ਮੁੱਖ ਐਡਮਿਨ ਲਈ ਸੁਰੱਖਿਅਤ ਹੈ। Gemini API ਕਨੈਕਟ ਕਰਨ ਲਈ ਗੁਪਤ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="ਐਡਮਿਨ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ..."
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-300 focus:border-[#14532D] focus:outline-none text-center font-mono text-base tracking-widest bg-amber-50/50"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 justify-center font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#14532D] text-[#EABF48] font-bold text-sm hover:bg-[#0a2f18] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>ਗੇਟਵੇਅ ਅਨਲੌਕ ਕਰੋ (Unlock Gateway)</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Unlocked Header */}
              <div className="bg-gradient-to-r from-[#14532D] to-[#1c6e3d] text-white rounded-3xl p-6 shadow-md border border-[#EABF48]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EABF48] text-[#14532D] flex items-center justify-center shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-white">Google Gemini AI ਕਮਾਂਡ ਸੈਂਟਰ</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ਅਨਲੌਕਡ
                      </span>
                    </div>
                    <p className="text-xs text-[#EDEDD6]">
                      ਲਾਈਵ Google Search ਗਰਾਊਂਡਿੰਗ ਅਤੇ Gemini 3.8 Flash ਮਾਡਲ ਕਨੈਕਸ਼ਨ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUnlocked(false);
                    setAdminPassword('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ਗੇਟਵੇਅ ਲਾਕ ਕਰੋ</span>
                </button>
              </div>

              {/* Status Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-gray-500 block">AI ਕੁਨੈਕਸ਼ਨ ਸਥਿਤੀ (Status)</span>
                  <div className="flex items-center gap-2 pt-1">
                    <span className={`w-3 h-3 rounded-full ${geminiStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className="text-base font-black text-gray-900">
                      {geminiStatus?.connected ? 'ਕਨੈਕਟ ਹੈ (Active & Live)' : 'ਕੁੰਜੀ ਦੀ ਉਡੀਕ (No Key Set)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {geminiStatus?.connected ? 'ਸਾਰੇ ਸਵਾਲ Google Gemini ਤੋਂ ਲਾਈਵ ਆ ਰਹੇ ਹਨ।' : 'ਹੇਠਾਂ API Key ਦਰਜ ਕਰਕੇ ਕਨੈਕਟ ਕਰੋ।'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-gray-500 block">ਮਾਡਲ ਅਤੇ ਗਰਾਊਂਡਿੰਗ</span>
                  <div className="text-base font-black text-[#14532D]">
                    {geminiStatus?.model || 'gemini-3.8-flash / gemini-flash-latest'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    ਲਾਈਵ ਸਰਚ ਟੂਲਸ (Google Search Grounding) + ਮਲਟੀ-ਮਾਡਲ ਫਾਲਬੈਕ ਸਮਰੱਥ ਹੈ।
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-gray-500 block">ਸਥਾਈ ਸਟੋਰੇਜ (Pre-Configured)</span>
                  <div className="text-base font-mono font-bold text-emerald-800">
                    {geminiStatus?.hasKey ? 'ਪੱਕੇ ਤੌਰ ਤੇ ਕਨੈਕਟਡ' : 'ਸੈੱਟ ਨਹੀਂ ਕੀਤੀ ਗਈ'}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    gemini-active-key.json ਵਿੱਚ ਸੁਰੱਖਿਅਤ
                  </p>
                </div>
              </div>

              {/* Pre-configured notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-950 font-bold mb-0.5">
                    ਪੱਕਾ ਕਨੈਕਸ਼ਨ (Permanent Backend Integration):
                  </strong>
                  ਇੱਥੇ ਦਰਜ ਕੀਤੀ ਕੁੰਜੀ ਸਰਵਰ ਵਿੱਚ ਪੱਕੇ ਤੌਰ 'ਤੇ ਸੇਵ ਰਹਿੰਦੀ ਹੈ। ਜੋ ਵੀ ਇਸ ਵੈੱਬਸਾਈਟ ਨੂੰ ਡਾਊਨਲੋਡ ਕਰੇਗਾ ਜਾਂ ਵਰਤੇਗਾ, ਇਹ API ਕੁੰਜੀ ਉਸਦੇ ਲਈ ਬੈਕਐਂਡ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਕਨੈਕਟ ਰਹੇਗੀ ਅਤੇ ਕਿਸੇ ਵੀ ਆਮ ਕਿਸਾਨ ਜਾਂ ਵਰਤੋਂਕਾਰ ਨੂੰ ਕੁੰਜੀ ਦਿਖਾਈ ਨਹੀਂ ਦੇਵੇਗੀ।
                </div>
              </div>

              {/* Form: Set / Update Gemini API Key */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-200 space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-base text-[#14532D] flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#EABF48]" />
                    <span>Gemini API Key ਦਰਜ ਜਾਂ ਅਪਡੇਟ ਕਰੋ (Configure Gemini Key)</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    ਆਪਣੀ Google Gemini API Key (ਜਿਵੇਂ AIzaSy...) ਇੱਥੇ ਪੇਸਟ ਕਰਕੇ ਸੇਵ ਕਰੋ।
                  </p>
                </div>

                <form onSubmit={handleSaveApiKey} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Google Gemini API Key:
                    </label>
                    <div className="relative">
                      <input
                        type={showKeyText ? 'text' : 'password'}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#14532D] focus:outline-none font-mono text-sm bg-gray-50/50 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeyText(!showKeyText)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                      >
                        {showKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {keySaveMessage && (
                    <div
                      className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                        keySaveMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {keySaveMessage.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                      )}
                      <span>{keySaveMessage.text}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingKey || !apiKeyInput.trim()}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#14532D] text-[#EABF48] font-bold text-xs sm:text-sm hover:bg-[#0a2f18] transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSavingKey ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>ਟੈਸਟ ਅਤੇ ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ਕੁੰਜੀ ਸੇਵ ਕਰੋ ਅਤੇ Gemini ਕਨੈਕਟ ਕਰੋ</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={fetchGeminiStatus}
                      className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ਸਥਿਤੀ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Test Live Gemini Response Console */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-200 space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-base text-[#14532D] flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#EABF48]" />
                    <span>ਲਾਈਵ AI ਟੈਸਟ ਕੰਸੋਲ (Test Live Gemini Response)</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    ਇੱਥੋਂ ਕੋਈ ਵੀ ਖੇਤੀਬਾੜੀ ਸਵਾਲ ਪੁੱਛ ਕੇ ਜਾਂਚੋ ਕਿ Google Gemini ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਕਿਵੇਂ ਜਵਾਬ ਦਿੰਦਾ ਹੈ।
                  </p>
                </div>

                {/* Quick 1-click test pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-500">1-ਕਲਿੱਕ ਟੈਸਟ ਸਵਾਲ:</span>
                  {[
                    'ਸਰਦੀਆਂ ਦੀਆਂ ਸਬਜ਼ੀਆਂ (ਆਲੂ, ਮਟਰ, ਟਮਾਟਰ) ਦੀ ਸਲਾਹ',
                    'ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਦੇਈਏ ਅਤੇ ਕਿੰਨੀ ਯੂਰੀਆ ਪਾਈਏ?',
                    'ਖੰਨਾ ਮੰਡੀ ਵਿੱਚ ਬਾਸਮਤੀ 1121 ਦਾ ਅੱਜ ਦਾ ਤਾਜ਼ਾ ਭਾਅ?',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTestPrompt(preset)}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 text-[11px] font-medium transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="ਟੈਸਟ ਸਵਾਲ ਲਿਖੋ (ਜਿਵੇਂ ਸਬਜ਼ੀਆਂ, ਪਾਣੀ, ਕਣਕ, ਨਰਮਾ, ਖਾਦ)..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#14532D] focus:outline-none text-xs sm:text-sm bg-gray-50/50"
                  />

                  <button
                    type="button"
                    onClick={handleRunTest}
                    disabled={isTesting || !testPrompt.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-[#EABF48] text-[#14532D] font-bold text-xs hover:bg-[#d6ad3e] transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Google Gemini ਤੋਂ ਜਵਾਬ ਪ੍ਰਾਪਤ ਹੋ ਰਿਹਾ ਹੈ...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ਟੈਸਟ ਕਾਲ ਭੇਜੋ (Run Test Prompt)</span>
                      </>
                    )}
                  </button>

                  {testResult && (
                    <div
                      className={`p-5 rounded-2xl text-xs space-y-2 border ${
                        testResult.success
                          ? 'bg-[#F7F7E9] border-[#14532D]/30 text-gray-800'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold pb-1 border-b border-gray-200/60">
                        <span className="flex items-center gap-1.5 text-[#14532D]">
                          <Sparkles className="w-4 h-4 text-[#EABF48]" />
                          <span>Google Gemini ਲਾਈਵ ਜਵਾਬ:</span>
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-sm">
                        {testResult.success ? testResult.reply : testResult.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

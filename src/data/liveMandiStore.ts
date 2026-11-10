import { MandiRateItem } from '../types';
import { MOCK_MANDI_RATES } from './mockData';

export interface LiveTradeLog {
  id: string;
  time: string;
  mandi: string;
  crop: string;
  quantityQuintals: number;
  ratePerQtl: number;
  buyer: string;
}

// Global subscribers for real-time reactivity
type Listener = (rates: MandiRateItem[], trades: LiveTradeLog[], lastUpdated: Date) => void;
const listeners: Set<Listener> = new Set();

let currentRates: MandiRateItem[] = [...MOCK_MANDI_RATES];
let liveTrades: LiveTradeLog[] = [
  {
    id: 'tr-1',
    time: '2 ਮਿੰਟ ਪਹਿਲਾਂ',
    mandi: 'ਖੰਨਾ ਮੰਡੀ (Khanna)',
    crop: 'ਕਣਕ (Wheat PBW 826)',
    quantityQuintals: 85,
    ratePerQtl: 2465,
    buyer: 'ਮਾਰਕਫੈੱਡ (Markfed)',
  },
  {
    id: 'tr-2',
    time: '4 ਮਿੰਟ ਪਹਿਲਾਂ',
    mandi: 'ਭਗਤਾਂਵਾਲਾ (Amritsar)',
    crop: 'ਬਾਸਮਤੀ 1121 (Basmati)',
    quantityQuintals: 120,
    ratePerQtl: 4180,
    buyer: 'ਕ੍ਰਿਸ਼ਨਾ ਐਕਸਪੋਰਟਸ',
  },
  {
    id: 'tr-3',
    time: '7 ਮਿੰਟ ਪਹਿਲਾਂ',
    mandi: 'ਬਠਿੰਡਾ ਮੰਡੀ (Bathinda)',
    crop: 'ਨਰਮਾ (Cotton)',
    quantityQuintals: 45,
    ratePerQtl: 7320,
    buyer: 'ਕਾਟਨ ਕਾਰਪੋਰੇਸ਼ਨ ਆਫ਼ ਇੰਡੀਆ (CCI)',
  },
];

let lastUpdateTime = new Date();
let intervalId: any = null;

function notify() {
  listeners.forEach((listener) => listener([...currentRates], [...liveTrades], lastUpdateTime));
}

// Start live real-time simulation interval (every 10 seconds updates a rate & arrival)
export function startLiveMandiUpdates() {
  if (intervalId) return;

  intervalId = setInterval(() => {
    // Pick a random mandi item to update
    const randomIndex = Math.floor(Math.random() * currentRates.length);
    const item = { ...currentRates[randomIndex] };

    // Small realistic fluctuation (-20 to +25)
    const delta = (Math.floor(Math.random() * 9) - 4) * 5; // -20, -15, -10, -5, 0, +5, +10, +15, +20
    const newModalPrice = Math.max(item.minPrice, Math.min(item.maxPrice, item.modalPrice + delta));

    // Increase arrivals slightly as morning/day progresses
    const newArrivals = item.arrivalQuantityQuintals + Math.floor(Math.random() * 35 + 10);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    item.modalPrice = newModalPrice;
    item.arrivalQuantityQuintals = newArrivals;
    item.trend = delta > 0 ? 'up' : delta < 0 ? 'down' : item.trend;
    item.trendPercent = Math.abs(Number(((delta / (item.modalPrice || 1)) * 100).toFixed(1)));
    item.date = `ਲਾਈਵ: ${timeStr}`;

    currentRates[randomIndex] = item;
    lastUpdateTime = now;

    // Add a live trade log
    const buyers = [
      'ਪਨਗ੍ਰੇਨ (Pungrain)',
      'ਮਾਰਕਫੈੱਡ (Markfed)',
      'ਪਨਸਪ (Pansup)',
      'ਐੱਫ.ਸੀ.ਆਈ. (FCI)',
      'ਪ੍ਰਾਈਵੇਟ ਮਿੱਲਰ (Khanna Millers)',
      'ਅਦਾਨੀ ਐਗਰੀ ਲੌਜਿਸਟਿਕਸ',
      'ਸ਼੍ਰੀ ਰਾਮ ਰਾਈਸ ਮਿੱਲ',
    ];

    const newTrade: LiveTradeLog = {
      id: `tr-${Date.now()}`,
      time: 'ਹੁਣੇ-ਹੁਣੇ (Just now)',
      mandi: item.mandi.split(' ')[0],
      crop: item.crop,
      quantityQuintals: Math.floor(Math.random() * 80 + 20),
      ratePerQtl: newModalPrice,
      buyer: buyers[Math.floor(Math.random() * buyers.length)],
    };

    liveTrades = [newTrade, ...liveTrades.slice(0, 7)];
    notify();
  }, 10000);
}

// Initial kickoff
startLiveMandiUpdates();

export function subscribeLiveMandi(listener: Listener) {
  listeners.add(listener);
  // initial call
  listener([...currentRates], [...liveTrades], lastUpdateTime);

  return () => {
    listeners.delete(listener);
  };
}

export function forceMandiRefresh() {
  // Immediately fluctuate a couple rates
  currentRates = currentRates.map((item) => {
    const delta = (Math.floor(Math.random() * 7) - 3) * 5;
    const newModal = Math.max(item.minPrice, Math.min(item.maxPrice, item.modalPrice + delta));
    return {
      ...item,
      modalPrice: newModal,
      arrivalQuantityQuintals: item.arrivalQuantityQuintals + Math.floor(Math.random() * 20),
      date: `ਤਾਜ਼ਾ ਅੱਪਡੇਟ: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
  });
  lastUpdateTime = new Date();
  notify();
}

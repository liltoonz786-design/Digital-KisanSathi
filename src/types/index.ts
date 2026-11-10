export type Language = 'punjabi' | 'hindi' | 'english';

export interface ProductItem {
  id: string;
  name: string;
  punjabiName: string;
  hindiName: string;
  category: 'Pesticide' | 'Herbicide' | 'Fungicide' | 'Fertilizer' | 'Seed' | 'Organic';
  brand: string;
  manufacturer: string;
  activeIngredient: string;
  mrp: number;
  packSize: string;
  unitPrice: string; // e.g., "₹450 / Litre"
  toxicity: 'Green' | 'Blue' | 'Yellow' | 'Red'; // Safety toxicity triangle
  toxicityLabel: string;
  verifiedDealerPrice: number;
  dealerLocation: string;
  description: string;
  imageUrl: string;
  barcode: string;
  dosage: string;
  targetPestsOrCrops: string;
  bestUsedFor: string;
}

export interface MandiRateItem {
  id: string;
  district: string;
  mandi: string;
  crop: string;
  punjabiCrop: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  msp: number;
  arrivalQuantityQuintals: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  date: string;
  source: 'AGMARKNET' | 'Punjab Mandi Board' | 'e-NAM';
}

export interface WeatherData {
  district: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeedKmh: number;
  rainProbability: number;
  sprayAdvisory: 'Favorable' | 'Moderate' | 'Avoid Spraying';
  sprayReason: string;
  forecast: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
  }>;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  punjabiTitle: string;
  shortDesc: string;
  category: 'Direct Income' | 'Subsidy' | 'Insurance' | 'Credit' | 'Irrigation' | 'Soil';
  benefits: string;
  subsidyAmount: string;
  eligibility: string[];
  documentsRequired: string[];
  deadlines: string;
  applicationProcess: string[];
  officialPortalUrl: string;
  status: 'Active' | 'Open for 2026' | 'Rolling';
}

export interface CropDiseaseDiagnosis {
  cropIdentified: string;
  diseaseName: string;
  confidenceScore: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  isCertain: boolean;
  symptoms: string[];
  causes: string[];
  organicTreatment: string[];
  chemicalTreatment: Array<{
    chemicalName: string;
    dosage: string;
    applicationMethod: string;
    safetyInterval: string;
  }>;
  preventiveMeasures: string[];
  safetyWarning: string;
}

export interface AgriHelpline {
  name: string;
  punjabiName: string;
  number: string;
  hours: string;
  desc: string;
}

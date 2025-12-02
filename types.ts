export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  uploadDate: string;
  rowCount: number;
  preview: any[];
  content: string; // Raw CSV content
}

export interface WordCloudItem {
  text: string;
  value: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface NLPResults {
  datasetId: string;
  stats: SentimentStats;
  wordCloud: WordCloudItem[];
  summary: string;
}

export interface ConfusionMatrix {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface ModelMetric {
  modelName: string; // e.g., "Logistic Regression", "Decision Tree"
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: ConfusionMatrix;
}

export interface AnalysisContextType {
  datasets: Dataset[];
  addDataset: (file: File) => Promise<void>;
  currentDataset: Dataset | null;
  setCurrentDataset: (d: Dataset) => void;
  nlpResults: NLPResults | null;
  modelMetrics: ModelMetric[];
  analyzeDataset: (dataset: Dataset) => Promise<void>;
  loading: boolean;
}
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, AuthState, Dataset, NLPResults, ModelMetric } from './types';
import { DatabaseService } from './services/mockBackend';
import { GeminiService } from './services/geminiService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import MLMetrics from './pages/MLMetrics';

// --- Auth Context ---
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Data Context ---
interface DataContextType {
  datasets: Dataset[];
  nlpResults: NLPResults | null;
  modelMetrics: ModelMetric[];
  loading: boolean;
  uploadDataset: (file: File) => Promise<void>;
  runAnalysis: (id: string) => Promise<void>;
  loadDashboardData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Protected Route Helper ---
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  // Data State
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [nlpResults, setNlpResults] = useState<NLPResults | null>(null);
  const [modelMetrics, setModelMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize Services
  const db = new DatabaseService();
  const gemini = new GeminiService();

  useEffect(() => {
    // Check session on load
    const checkSession = async () => {
      if (auth.token) {
        const user = await db.getUserProfile(auth.token);
        if (user) {
          setAuth({ user, token: auth.token, isAuthenticated: true });
        } else {
          logout();
        }
      }
    };
    checkSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await db.login(email, pass);
    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      setAuth({ user: res.user, token: res.token, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    await db.register(name, email, pass);
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ user: null, token: null, isAuthenticated: false });
    setDatasets([]);
    setNlpResults(null);
    setModelMetrics([]);
  };

  const uploadDataset = async (file: File) => {
    setLoading(true);
    try {
      const text = await file.text();
      // Simple CSV Parse for preview
      const rows = text.split('\n').map(r => r.split(','));
      const preview = rows.slice(0, 5);
      
      const newDataset: Dataset = {
        id: crypto.randomUUID(),
        name: file.name,
        uploadDate: new Date().toISOString(),
        rowCount: rows.length,
        preview,
        content: text
      };
      
      await db.saveDataset(newDataset);
      setDatasets(prev => [...prev, newDataset]);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (datasetId: string) => {
    setLoading(true);
    try {
      const dataset = await db.getDataset(datasetId);
      if (!dataset) throw new Error("Dataset not found");

      // 1. NLP Analysis via Gemini
      const results = await gemini.analyzeSentiment(dataset.content);
      const resultsWithId = { ...results, datasetId };
      setNlpResults(resultsWithId);

      // 2. ML Metrics via Gemini
      const metrics = await gemini.generateMLMetrics(dataset.content);
      setModelMetrics(metrics);

    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please check your API Key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    const d = await db.getAllDatasets();
    setDatasets(d);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      <DataContext.Provider value={{ datasets, nlpResults, modelMetrics, loading, uploadDataset, runAnalysis, loadDashboardData }}>
        <HashRouter>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/upload" element={
                  <ProtectedRoute><Upload /></ProtectedRoute>
                } />
                <Route path="/analysis" element={
                  <ProtectedRoute><Analysis /></ProtectedRoute>
                } />
                <Route path="/metrics" element={
                  <ProtectedRoute><MLMetrics /></ProtectedRoute>
                } />
              </Routes>
            </div>
            <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
              &copy; {new Date().getFullYear()} Sentilytics. Powered by Gemini API & React.
            </footer>
          </div>
        </HashRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
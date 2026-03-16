import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { createClient, Session } from '@supabase/supabase-js';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import ModerationQueue from './pages/ModerationQueue';

// ── Supabase admin client (email/password login, not magic link) ──────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── API helper ────────────────────────────────────────────────────────────────
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const base = import.meta.env.VITE_API_URL || '';
  return fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

// ── Auth context ─────────────────────────────────────────────────────────────
interface AuthCtx { session: Session | null; loading: boolean }
const AuthContext = createContext<AuthCtx>({ session: null, loading: true });
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>;
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <h1 style={s.loginTitle}>CofC Admin</h1>
        <p style={s.loginSub}>Sign in with your admin account</p>
        {error && <p style={s.error}>{error}</p>}
        <form onSubmit={handleLogin} style={s.form}>
          <input
            style={s.input}
            type="email"
            placeholder="admin@cofc.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Shell with sidebar ────────────────────────────────────────────────────────
function Shell() {
  const { session, loading } = useAuth();

  if (loading) return <div style={s.center}>Loading…</div>;
  if (!session) return <LoginPage />;

  const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    display: 'block',
    padding: '10px 16px',
    borderRadius: 6,
    color: isActive ? '#fff' : '#94a3b8',
    backgroundColor: isActive ? '#8C1D40' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    marginBottom: 4,
  });

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={s.brand}>CofC Admin</div>
        <nav>
          <NavLink to="/" end style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/users" style={linkStyle}>Users</NavLink>
          <NavLink to="/queue" style={linkStyle}>Mod Queue</NavLink>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button
            style={{ ...s.btn, fontSize: 12, padding: '8px 14px', marginTop: 16 }}
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main style={s.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/queue" element={<ModerationQueue />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  loginWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1117' },
  loginCard: { background: '#1e2535', borderRadius: 12, padding: 32, width: 360, border: '1px solid #2d3748' },
  loginTitle: { fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' },
  loginSub: { fontSize: 13, color: '#94a3b8', marginBottom: 20 },
  error: { color: '#f87171', fontSize: 13, marginBottom: 12 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1px solid #374151',
    background: '#111827', color: '#f1f5f9', fontSize: 14, outline: 'none',
  },
  btn: {
    padding: '10px 18px', borderRadius: 8, border: 'none',
    background: '#8C1D40', color: '#fff', fontWeight: 600,
    fontSize: 14, cursor: 'pointer',
  },
  shell: { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: {
    width: 200, background: '#1a1f2e', borderRight: '1px solid #2d3748',
    padding: '24px 16px', display: 'flex', flexDirection: 'column',
    flexShrink: 0,
  },
  brand: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 },
  main: { flex: 1, overflow: 'auto', padding: 24, background: '#0f1117' },
};

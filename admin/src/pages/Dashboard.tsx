import React, { useEffect, useState } from 'react';
import { apiFetch } from '../App';

interface Stats {
  total_users: number;
  total_posts: number;
  posts_today: number;
  open_reports: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError('Failed to load stats'));
  }, []);

  return (
    <div>
      <h2 style={s.heading}>Dashboard</h2>
      {error && <p style={s.error}>{error}</p>}
      <div style={s.grid}>
        <StatCard label="Total Users" value={stats?.total_users} color="#3b82f6" />
        <StatCard label="Total Posts" value={stats?.total_posts} color="#10b981" />
        <StatCard label="Posts Today" value={stats?.posts_today} color="#8b5cf6" />
        <StatCard label="Open Reports" value={stats?.open_reports} color="#ef4444" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value?: number; color: string }) {
  return (
    <div style={{ ...s.card, borderTop: `3px solid ${color}` }}>
      <div style={s.cardValue}>{value ?? '—'}</div>
      <div style={s.cardLabel}>{label}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  heading: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#f1f5f9' },
  error: { color: '#f87171', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 },
  card: {
    background: '#1e2535', borderRadius: 10, padding: '20px 24px',
    border: '1px solid #2d3748',
  },
  cardValue: { fontSize: 32, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  cardLabel: { fontSize: 13, color: '#94a3b8' },
};

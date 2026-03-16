import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../App';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set('q', q);
    const r = await apiFetch(`/api/admin/users?${params}`);
    const data = await r.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [q, page]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    load();
  }

  const statusColor: Record<string, string> = {
    active: '#10b981', warned: '#f59e0b', suspended: '#ef4444', banned: '#7f1d1d',
  };

  return (
    <div>
      <h2 style={s.heading}>Users ({total})</h2>

      <form onSubmit={handleSearch} style={s.searchRow}>
        <input
          style={s.input}
          placeholder="Search by email…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button style={s.btn} type="submit">Search</button>
        {q && (
          <button style={{ ...s.btn, background: '#374151' }} type="button" onClick={() => { setQ(''); setPage(0); }}>
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading…</p>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {['Email', 'Role', 'Status', 'Joined'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr
                key={u.id}
                style={s.tr}
                onClick={() => navigate(`/users/${u.id}`)}
              >
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>{u.role}</td>
                <td style={s.td}>
                  <span style={{
                    ...s.badge,
                    background: `${statusColor[u.status] || '#6b7280'}22`,
                    color: statusColor[u.status] || '#6b7280',
                  }}>
                    {u.status}
                  </span>
                </td>
                <td style={s.td}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={s.pagination}>
        <button style={s.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>Page {page + 1}</span>
        <button style={s.pageBtn} disabled={users.length < 50} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  heading: { fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#f1f5f9' },
  searchRow: { display: 'flex', gap: 8, marginBottom: 20 },
  input: {
    flex: 1, padding: '9px 14px', borderRadius: 8, border: '1px solid #374151',
    background: '#111827', color: '#f1f5f9', fontSize: 14, outline: 'none',
  },
  btn: {
    padding: '9px 18px', borderRadius: 8, border: 'none',
    background: '#8C1D40', color: '#fff', fontWeight: 600,
    fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 14px',
    borderBottom: '1px solid #2d3748', color: '#94a3b8', fontSize: 12,
    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  tr: { cursor: 'pointer', transition: 'background 0.1s' },
  td: { padding: '12px 14px', borderBottom: '1px solid #1e2535', fontSize: 14, color: '#e2e8f0' },
  badge: { padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
  pagination: { display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 },
  pageBtn: {
    padding: '7px 14px', borderRadius: 6, border: '1px solid #374151',
    background: '#1e2535', color: '#e2e8f0', cursor: 'pointer', fontSize: 13,
  },
};

import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../App';

interface Report {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_id: string;
}

export default function ModerationQueue() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch(`/api/admin/reports?status=open&page=${page}`);
    const data = await r.json();
    setReports(data.reports || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function resolve(id: string, status: 'resolved' | 'dismissed') {
    const r = await apiFetch(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    const data = await r.json();
    if (data.ok) {
      setReports(prev => prev.filter(r => r.id !== id));
      setSelected(prev => { prev.delete(id); return new Set(prev); });
    } else {
      setMsg(data.error || 'Error');
    }
  }

  async function bulkResolve(status: 'resolved' | 'dismissed') {
    const ids = Array.from(selected);
    await Promise.all(ids.map(id => resolve(id, status)));
    setSelected(new Set());
    setMsg(`${ids.length} report(s) ${status}.`);
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const reasonColor: Record<string, string> = {
    spam: '#6b7280', harassment: '#ef4444', inappropriate: '#f59e0b',
    misinformation: '#8b5cf6', other: '#3b82f6',
  };

  return (
    <div>
      <div style={s.headerRow}>
        <h2 style={s.heading}>Moderation Queue ({total} open)</h2>
        {selected.size > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...s.btn, background: '#10b981' }} onClick={() => bulkResolve('resolved')}>
              Resolve {selected.size}
            </button>
            <button style={{ ...s.btn, background: '#374151' }} onClick={() => bulkResolve('dismissed')}>
              Dismiss {selected.size}
            </button>
          </div>
        )}
      </div>

      {msg && <div style={s.flash}>{msg}</div>}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading…</p>
      ) : reports.length === 0 ? (
        <div style={s.empty}>
          <p style={{ fontSize: 32 }}>✓</p>
          <p>No open reports</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}><input type="checkbox" onChange={e => {
                if (e.target.checked) setSelected(new Set(reports.map(r => r.id)));
                else setSelected(new Set());
              }} /></th>
              {['Type', 'Target ID', 'Reason', 'Reported', 'Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={selected.has(r.id) ? s.trSelected : s.tr}>
                <td style={s.td}>
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} />
                </td>
                <td style={s.td}>{r.target_type}</td>
                <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 11, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.target_id}
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: `${reasonColor[r.reason] || '#6b7280'}22`, color: reasonColor[r.reason] || '#6b7280' }}>
                    {r.reason}
                  </span>
                </td>
                <td style={s.td}>{new Date(r.created_at).toLocaleString()}</td>
                <td style={s.td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ ...s.smallBtn, background: '#10b981' }} onClick={() => resolve(r.id, 'resolved')}>
                      Resolve
                    </button>
                    <button style={{ ...s.smallBtn, background: '#374151' }} onClick={() => resolve(r.id, 'dismissed')}>
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={s.pagination}>
        <button style={s.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>Page {page + 1}</span>
        <button style={s.pageBtn} disabled={reports.length < 50} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { fontSize: 20, fontWeight: 700, color: '#f1f5f9' },
  flash: { background: '#1e2535', border: '1px solid #374151', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#10b981', fontSize: 14 },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #2d3748', color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: {},
  trSelected: { background: 'rgba(140,29,64,0.08)' },
  td: { padding: '12px 12px', borderBottom: '1px solid #1e2535', fontSize: 13, color: '#e2e8f0' },
  badge: { padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
  btn: { padding: '8px 16px', borderRadius: 6, border: 'none', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  smallBtn: { padding: '4px 10px', borderRadius: 5, border: 'none', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  pagination: { display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 },
  pageBtn: { padding: '7px 14px', borderRadius: 6, border: '1px solid #374151', background: '#1e2535', color: '#e2e8f0', cursor: 'pointer', fontSize: 13 },
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../App';

interface UserProfile {
  user: { id: string; email: string; role: string; status: string; created_at: string };
  aliases: { id: string; alias: string; active: boolean; created_at: string }[];
  posts: { id: string; channel: string; body: string; status: string; created_at: string; reports_count: number }[];
  security: { last_ip: string; device_class: string; coarse_geo: string; risk_score: number; last_seen_at: string } | null;
  moderation_history: { id: string; action: string; note: string | null; created_at: string }[];
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function doAction(endpoint: string) {
    const r = await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ note: actionNote }),
    });
    const data = await r.json();
    if (data.ok) {
      setMsg('Action applied.');
      setActionNote('');
      // Refresh
      apiFetch(`/api/admin/users/${id}`).then(r => r.json()).then(setProfile);
    } else {
      setMsg(data.error || 'Error');
    }
  }

  async function doPostAction(postId: string, action: 'hide' | 'delete') {
    const r = await apiFetch(`/api/admin/posts/${postId}/${action}`, { method: 'POST' });
    const data = await r.json();
    if (data.ok) {
      setMsg(`Post ${action}d.`);
      apiFetch(`/api/admin/users/${id}`).then(r => r.json()).then(setProfile);
    }
  }

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading…</p>;
  if (!profile) return <p style={{ color: '#f87171' }}>User not found.</p>;

  const { user, aliases, posts, security, moderation_history } = profile;

  const statusColor: Record<string, string> = {
    active: '#10b981', warned: '#f59e0b', suspended: '#ef4444', banned: '#7f1d1d',
  };

  return (
    <div>
      <button onClick={() => navigate('/users')} style={s.back}>← Users</button>
      <h2 style={s.heading}>{user.email}</h2>

      {msg && <div style={s.flashMsg}>{msg}</div>}

      {/* ── Info ── */}
      <Section title="Account">
        <InfoRow label="ID" value={user.id} />
        <InfoRow label="Role" value={user.role} />
        <InfoRow label="Status">
          <span style={{ color: statusColor[user.status] || '#6b7280', fontWeight: 600 }}>{user.status}</span>
        </InfoRow>
        <InfoRow label="Joined" value={new Date(user.created_at).toLocaleString()} />
      </Section>

      {/* ── Security ── */}
      {security && (
        <Section title="Security">
          <InfoRow label="Last IP" value={security.last_ip || '—'} />
          <InfoRow label="Device" value={security.device_class || '—'} />
          <InfoRow label="Location" value={security.coarse_geo || '—'} />
          <InfoRow label="Risk Score" value={String(security.risk_score)} />
          <InfoRow label="Last Seen" value={new Date(security.last_seen_at).toLocaleString()} />
        </Section>
      )}

      {/* ── Aliases ── */}
      <Section title={`Aliases (${aliases.length})`}>
        {aliases.length === 0 ? <p style={s.muted}>None</p> : (
          <div style={s.tags}>
            {aliases.map(a => (
              <span key={a.id} style={{ ...s.tag, opacity: a.active ? 1 : 0.4 }}>
                {a.alias}{!a.active ? ' (inactive)' : ''}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* ── Moderation actions ── */}
      <Section title="Moderate User">
        <textarea
          style={s.textarea}
          placeholder="Optional note…"
          value={actionNote}
          onChange={e => setActionNote(e.target.value)}
          rows={2}
        />
        <div style={s.actionRow}>
          <ActionBtn label="Warn" color="#f59e0b" onClick={() => doAction(`/api/admin/users/${id}/warn`)} />
          <ActionBtn label="Suspend" color="#ef4444" onClick={() => doAction(`/api/admin/users/${id}/suspend`)} />
          <ActionBtn label="Ban" color="#7f1d1d" onClick={() => doAction(`/api/admin/users/${id}/ban`)} />
        </div>
      </Section>

      {/* ── Posts ── */}
      <Section title={`Posts (${posts.length})`}>
        {posts.length === 0 ? <p style={s.muted}>No posts</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Channel', 'Body', 'Status', 'Reports', 'Date', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td style={s.td}>{p.channel}</td>
                  <td style={{ ...s.td, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.body}
                  </td>
                  <td style={s.td}>{p.status}</td>
                  <td style={s.td}>{p.reports_count}</td>
                  <td style={s.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={s.td}>
                    {p.status === 'active' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionBtn label="Hide" color="#f59e0b" small onClick={() => doPostAction(p.id, 'hide')} />
                        <ActionBtn label="Del" color="#ef4444" small onClick={() => doPostAction(p.id, 'delete')} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* ── Mod history ── */}
      <Section title={`Moderation History (${moderation_history.length})`}>
        {moderation_history.length === 0 ? <p style={s.muted}>None</p> : (
          <table style={s.table}>
            <thead>
              <tr>
                {['Action', 'Note', 'Date'].map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {moderation_history.map(a => (
                <tr key={a.id}>
                  <td style={s.td}>{a.action}</td>
                  <td style={s.td}>{a.note || '—'}</td>
                  <td style={s.td}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.section}>
      <h3 style={s.sectionTitle}>{title}</h3>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{children ?? value}</span>
    </div>
  );
}

function ActionBtn({
  label, color, onClick, small,
}: {
  label: string; color: string; onClick: () => void; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '4px 10px' : '8px 16px',
        borderRadius: 6, border: 'none',
        background: color, color: '#fff',
        fontWeight: 600, fontSize: small ? 12 : 14, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

const s: Record<string, React.CSSProperties> = {
  back: {
    background: 'none', border: '1px solid #374151', color: '#94a3b8',
    padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, marginBottom: 16,
  },
  heading: { fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 },
  flashMsg: {
    background: '#1e2535', border: '1px solid #374151', borderRadius: 8,
    padding: '10px 16px', marginBottom: 16, color: '#10b981', fontSize: 14,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' },
  sectionBody: { background: '#1e2535', borderRadius: 10, padding: 16, border: '1px solid #2d3748' },
  infoRow: { display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #2d3748' },
  infoLabel: { width: 120, color: '#94a3b8', fontSize: 13, flexShrink: 0 },
  infoValue: { color: '#e2e8f0', fontSize: 13 },
  muted: { color: '#94a3b8', fontSize: 13 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: { background: '#374151', borderRadius: 4, padding: '3px 10px', fontSize: 13, color: '#e2e8f0' },
  textarea: {
    width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #374151',
    background: '#111827', color: '#f1f5f9', fontSize: 13, marginBottom: 10, resize: 'vertical',
  },
  actionRow: { display: 'flex', gap: 8 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #2d3748',
    color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  td: { padding: '10px 12px', borderBottom: '1px solid #1e2535', fontSize: 13, color: '#e2e8f0' },
};

import { Router, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';
import { AuthRequest, ModerationAction } from '../types';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth);
router.use(requireAdmin);

// ── Users ─────────────────────────────────────────────────────

// GET /api/admin/users?q=email_or_alias&page=0
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  const q = req.query.q as string;
  const page = parseInt(req.query.page as string) || 0;
  const PAGE = 50;

  let query = supabaseAdmin
    .from('users')
    .select('id, email, role, status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * PAGE, page * PAGE + PAGE - 1);

  if (q) {
    query = query.ilike('email', `%${q}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ users: data, total: count, page });
});

// GET /api/admin/users/:id — full profile
router.get('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const [userRes, aliasesRes, postsRes, securityRes, actionsRes] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select('id, email, role, status, created_at')
      .eq('id', id)
      .single(),
    supabaseAdmin
      .from('user_aliases')
      .select('id, alias, active, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('posts')
      .select('id, channel, body, status, created_at, reports_count')
      .eq('author_user_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('security_profiles')
      .select('last_ip, device_class, coarse_geo, risk_score, last_seen_at')
      .eq('user_id', id)
      .single(),
    supabaseAdmin
      .from('moderation_actions')
      .select('id, action, note, created_at')
      .eq('target_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (!userRes.data) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: userRes.data,
    aliases: aliasesRes.data || [],
    posts: postsRes.data || [],
    security: securityRes.data || null,
    moderation_history: actionsRes.data || [],
  });
});

// ── Posts ─────────────────────────────────────────────────────

// POST /api/admin/posts/:id/hide
router.post('/posts/:id/hide', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { note } = req.body;

  const { error } = await supabaseAdmin
    .from('posts')
    .update({ status: 'hidden', visibility: 'hidden' })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await logAction(req.user!.id, 'hide', 'post', id, note);
  res.json({ ok: true });
});

// POST /api/admin/posts/:id/delete
router.post('/posts/:id/delete', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { note } = req.body;

  const { error } = await supabaseAdmin
    .from('posts')
    .update({ status: 'deleted' })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await logAction(req.user!.id, 'delete', 'post', id, note);
  res.json({ ok: true });
});

// ── User moderation ───────────────────────────────────────────

// POST /api/admin/users/:id/warn
router.post('/users/:id/warn', async (req: AuthRequest, res: Response): Promise<void> => {
  await moderateUser(req, res, 'warn', 'warned');
});

// POST /api/admin/users/:id/suspend
router.post('/users/:id/suspend', async (req: AuthRequest, res: Response): Promise<void> => {
  await moderateUser(req, res, 'suspend', 'suspended');
});

// POST /api/admin/users/:id/ban
router.post('/users/:id/ban', async (req: AuthRequest, res: Response): Promise<void> => {
  await moderateUser(req, res, 'ban', 'banned');
});

async function moderateUser(
  req: AuthRequest,
  res: Response,
  action: ModerationAction,
  status: string
): Promise<void> {
  const { id } = req.params;
  const { note } = req.body;

  const { error } = await supabaseAdmin
    .from('users')
    .update({ status })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  await logAction(req.user!.id, action, 'user', id, note);
  res.json({ ok: true });
}

// ── Reports ───────────────────────────────────────────────────

// GET /api/admin/reports?status=open&page=0
router.get('/reports', async (req: AuthRequest, res: Response): Promise<void> => {
  const status = (req.query.status as string) || 'open';
  const page = parseInt(req.query.page as string) || 0;
  const PAGE = 50;

  const { data, error, count } = await supabaseAdmin
    .from('reports')
    .select(
      'id, target_type, target_id, reason, status, created_at, reporter_id',
      { count: 'exact' }
    )
    .eq('status', status)
    .order('created_at', { ascending: true })
    .range(page * PAGE, page * PAGE + PAGE - 1);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ reports: data, total: count, page });
});

// PATCH /api/admin/reports/:id  — resolve or dismiss
router.patch('/reports/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body; // 'resolved' | 'dismissed'

  if (!['resolved', 'dismissed'].includes(status)) {
    res.status(400).json({ error: 'status must be "resolved" or "dismissed"' });
    return;
  }

  const { data: report, error: fetchError } = await supabaseAdmin
    .from('reports')
    .select('id, target_type, target_id')
    .eq('id', id)
    .single();

  if (fetchError || !report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const { error } = await supabaseAdmin
    .from('reports')
    .update({ status })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const action = status === 'resolved' ? 'resolve' : 'dismiss';
  await logAction(req.user!.id, action, report.target_type, report.target_id);
  res.json({ ok: true });
});

// ── Stats ─────────────────────────────────────────────────────

// GET /api/admin/stats
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [usersRes, postsRes, postsToday, reportsRes] = await Promise.all([
    supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
    supabaseAdmin
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open'),
  ]);

  res.json({
    total_users: usersRes.count ?? 0,
    total_posts: postsRes.count ?? 0,
    posts_today: postsToday.count ?? 0,
    open_reports: reportsRes.count ?? 0,
  });
});

// ── Helper ────────────────────────────────────────────────────

async function logAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  note?: string
): Promise<void> {
  await supabaseAdmin.from('moderation_actions').insert({
    admin_id: adminId,
    target_type: targetType,
    target_id: targetId,
    action,
    note: note || null,
  });

  await supabaseAdmin.from('audit_logs').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: note ? { note } : null,
  });
}

export default router;

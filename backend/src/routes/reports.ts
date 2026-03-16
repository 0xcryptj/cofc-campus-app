import { Router, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth } from '../middleware/requireAuth';
import { AuthRequest, ReportReason } from '../types';

const router = Router();

// POST /api/reports
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { target_type, target_id, reason } = req.body;

  const validTypes = ['post', 'comment', 'user'];
  const validReasons: ReportReason[] = ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'];

  if (!validTypes.includes(target_type)) {
    res.status(400).json({ error: 'Invalid target_type' });
    return;
  }
  if (!validReasons.includes(reason)) {
    res.status(400).json({ error: 'Invalid reason' });
    return;
  }
  if (!target_id) {
    res.status(400).json({ error: 'target_id is required' });
    return;
  }

  // Check for duplicate report from same user
  const { data: existing } = await supabaseAdmin
    .from('reports')
    .select('id')
    .eq('reporter_id', req.user!.id)
    .eq('target_id', target_id)
    .eq('status', 'open')
    .single();

  if (existing) {
    res.status(409).json({ error: 'You already reported this content' });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('reports')
    .insert({
      reporter_id: req.user!.id,
      target_type,
      target_id,
      reason,
    })
    .select('id, target_type, target_id, reason, status, created_at')
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // Bump reports_count on the target
  if (target_type === 'post') {
    await supabaseAdmin.rpc('increment_post_reports', { post_id: target_id }).catch(() => {
      // Non-critical — ignore if RPC doesn't exist
    });
  } else if (target_type === 'comment') {
    await supabaseAdmin.rpc('increment_comment_reports', { comment_id: target_id }).catch(() => {});
  }

  res.status(201).json({ report: data });
});

export default router;

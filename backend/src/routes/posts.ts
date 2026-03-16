import { Router, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { requireAuth } from '../middleware/requireAuth';
import { AuthRequest, Channel } from '../types';

const router = Router();

const PAGE_SIZE = 20;

// GET /api/posts?channel=general&page=0
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const channel = (req.query.channel as Channel) || 'general';
  const page = parseInt(req.query.page as string) || 0;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('id, channel, public_alias, body, image_id, upvote_count, comment_count, created_at')
    .eq('channel', channel)
    .eq('status', 'active')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ posts: data, page, pageSize: PAGE_SIZE });
});

// POST /api/posts
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { channel, body, public_alias, image_id } = req.body;

  if (!channel || !body || !public_alias) {
    res.status(400).json({ error: 'channel, body, and public_alias are required' });
    return;
  }

  const validChannels: Channel[] = ['general', 'dating', 'lore', 'events'];
  if (!validChannels.includes(channel)) {
    res.status(400).json({ error: 'Invalid channel' });
    return;
  }

  if (body.length > 500) {
    res.status(400).json({ error: 'Post body exceeds 500 characters' });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({
      channel,
      author_user_id: req.user!.id,
      public_alias,
      body,
      image_id: image_id || null,
    })
    .select('id, channel, public_alias, body, upvote_count, comment_count, created_at')
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ post: data });
});

// POST /api/posts/:id/upvote
router.post('/:id/upvote', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Increment via rpc or direct update — simple increment for MVP
  const { data: post, error: fetchErr } = await supabaseAdmin
    .from('posts')
    .select('upvote_count')
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (fetchErr || !post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const { error } = await supabaseAdmin
    .from('posts')
    .update({ upvote_count: post.upvote_count + 1 })
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ upvote_count: post.upvote_count + 1 });
});

// GET /api/posts/:id/comments
router.get('/:id/comments', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('id, post_id, public_alias, body, created_at')
    .eq('post_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ comments: data });
});

// POST /api/posts/:id/comments
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { body, public_alias } = req.body;

  if (!body || !public_alias) {
    res.status(400).json({ error: 'body and public_alias are required' });
    return;
  }

  if (body.length > 500) {
    res.status(400).json({ error: 'Comment body exceeds 500 characters' });
    return;
  }

  // Verify post exists
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('id')
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({
      post_id: id,
      author_user_id: req.user!.id,
      public_alias,
      body,
    })
    .select('id, post_id, public_alias, body, created_at')
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ comment: data });
});

export default router;

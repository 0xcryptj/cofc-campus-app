import { supabase } from '../lib/supabase';
import type { Channel, Post, Comment, ReportReason } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res;
}

// ── Posts ──────────────────────────────────────────────────────

export interface ApiPost {
  id: string;
  channel: Channel;
  public_alias: string;
  body: string;
  image_id?: string;
  upvote_count: number;
  comment_count: number;
  created_at: string;
}

export async function getPosts(channel: Channel, page = 0): Promise<ApiPost[]> {
  const res = await authFetch(`/api/posts?channel=${channel}&page=${page}`);
  const data = await res.json();
  return data.posts as ApiPost[];
}

export async function createPost(params: {
  channel: Channel;
  body: string;
  public_alias: string;
  image_id?: string;
}): Promise<ApiPost> {
  const res = await authFetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data.post as ApiPost;
}

export async function upvotePost(postId: string): Promise<{ upvote_count: number }> {
  const res = await authFetch(`/api/posts/${postId}/upvote`, { method: 'POST' });
  return res.json();
}

// ── Comments ──────────────────────────────────────────────────

export interface ApiComment {
  id: string;
  post_id: string;
  public_alias: string;
  body: string;
  created_at: string;
}

export async function getComments(postId: string): Promise<ApiComment[]> {
  const res = await authFetch(`/api/posts/${postId}/comments`);
  const data = await res.json();
  return data.comments as ApiComment[];
}

export async function addComment(params: {
  postId: string;
  body: string;
  public_alias: string;
}): Promise<ApiComment> {
  const res = await authFetch(`/api/posts/${params.postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body: params.body, public_alias: params.public_alias }),
  });
  const data = await res.json();
  return data.comment as ApiComment;
}

// ── Reports ───────────────────────────────────────────────────

export async function submitReport(params: {
  target_type: 'post' | 'comment';
  target_id: string;
  reason: ReportReason;
}): Promise<void> {
  await authFetch('/api/reports', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ── Aliases ───────────────────────────────────────────────────

export interface ApiAlias {
  id: string;
  alias: string;
  active: boolean;
  created_at: string;
}

export async function getAliases(): Promise<ApiAlias[]> {
  const { data, error } = await supabase
    .from('user_aliases')
    .select('id, alias, active, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as ApiAlias[];
}

export async function createAlias(alias: string): Promise<ApiAlias> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_aliases')
    .insert({ user_id: user.id, alias })
    .select('id, alias, active, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data as ApiAlias;
}

export async function deleteAlias(aliasId: string): Promise<void> {
  const { error } = await supabase
    .from('user_aliases')
    .delete()
    .eq('id', aliasId);

  if (error) throw new Error(error.message);
}

// Map API post → local Post type used by the UI
export function apiPostToLocal(p: ApiPost): Post {
  return {
    id: p.id,
    channel: p.channel,
    anonIdentityId: '',
    anonDisplayName: p.public_alias,
    textBody: p.body,
    upvoteCount: p.upvote_count,
    commentCount: p.comment_count,
    shareCount: 0,
    createdAt: p.created_at,
    upvotedByMe: false,
  };
}

// Map API comment → local Comment type
export function apiCommentToLocal(c: ApiComment): Comment {
  return {
    id: c.id,
    postId: c.post_id,
    anonIdentityId: '',
    anonDisplayName: c.public_alias,
    text: c.body,
    createdAt: c.created_at,
  };
}

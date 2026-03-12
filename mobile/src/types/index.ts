// ─── Channels ────────────────────────────────────────────────────────────────

export type Channel = 'dating' | 'general' | 'lore';

export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'dating', label: 'Dating' },
  { id: 'general', label: 'General CofC' },
  { id: 'lore', label: 'Misc Lore' },
];

// ─── Anonymous Identity ───────────────────────────────────────────────────────

export interface AnonIdentity {
  id: string;
  displayName: string;   // e.g. "Purple Fox"
  avatarColor: string;   // hex color
  createdAt: string;     // ISO date string
}

// ─── Post ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  channel: Channel;
  anonIdentityId: string;
  anonDisplayName: string;
  anonAvatarColor: string;
  textBody: string;
  imageUri?: string;       // local URI for now; Supabase Storage URL later
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
  upvotedByMe: boolean;    // tracked locally for now
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  postId: string;
  anonIdentityId: string;
  anonDisplayName: string;
  anonAvatarColor: string;
  text: string;
  createdAt: string;
}

// ─── Moderation ───────────────────────────────────────────────────────────────

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'misinformation'
  | 'other';

export interface ModerationLog {
  id: string;
  reporterId: string;       // anon identity id of reporter
  contentId: string;        // post id or comment id
  contentType: 'post' | 'comment';
  reason: ReportReason;
  timestamp: string;
}

export type Channel = 'general' | 'dating' | 'lore' | 'events';

export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'dating', label: 'Dating' },
  { id: 'lore', label: 'Misc Lore' },
  { id: 'events', label: 'Events' },
];

export interface AnonIdentity {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface Post {
  id: string;
  channel: Channel;
  anonIdentityId: string;
  anonDisplayName: string;
  textBody: string;
  imageUri?: string;
  upvoteCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  upvotedByMe: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  anonIdentityId: string;
  anonDisplayName: string;
  text: string;
  createdAt: string;
}

export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';

export interface ModerationLog {
  id: string;
  reporterId: string;
  contentId: string;
  contentType: 'post' | 'comment';
  reason: ReportReason;
  timestamp: string;
}

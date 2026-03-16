import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'warned' | 'suspended' | 'banned';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export type Channel = 'general' | 'dating' | 'lore' | 'events';

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'misinformation'
  | 'other';

export type ModerationAction = 'warn' | 'hide' | 'delete' | 'suspend' | 'ban' | 'restore';

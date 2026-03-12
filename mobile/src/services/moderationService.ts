import type { ModerationLog, ReportReason } from '../types';

// In-memory store for now. Will be replaced with Supabase inserts.
const logs: ModerationLog[] = [];

export function logReport(params: {
  reporterId: string;
  contentId: string;
  contentType: 'post' | 'comment';
  reason: ReportReason;
}): ModerationLog {
  const entry: ModerationLog = {
    id: `mod-${Date.now()}`,
    reporterId: params.reporterId,
    contentId: params.contentId,
    contentType: params.contentType,
    reason: params.reason,
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  console.log('[Moderation] Report logged:', entry); // visible in Expo terminal
  return entry;
}

// Useful for an admin dashboard later
export function getAllLogs(): ModerationLog[] {
  return [...logs];
}

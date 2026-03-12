import type { Post, Comment, AnonIdentity } from '../types';

// ─── Mock identities ──────────────────────────────────────────────────────────

export const MOCK_IDENTITIES: AnonIdentity[] = [
  {
    id: 'id-1',
    displayName: 'Purple Fox',
    avatarColor: '#4A148C',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'id-2',
    displayName: 'Maroon Bear',
    avatarColor: '#6B1D1D',
    createdAt: '2025-01-02T00:00:00Z',
  },
];

// ─── Mock posts ───────────────────────────────────────────────────────────────

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    channel: 'general',
    anonIdentityId: 'id-1',
    anonDisplayName: 'Purple Fox',
    anonAvatarColor: '#4A148C',
    textBody: 'Anyone else think the library is freezing cold today? It has to be 60 degrees in here.',
    upvoteCount: 24,
    commentCount: 3,
    createdAt: '2025-03-11T10:30:00Z',
    upvotedByMe: false,
  },
  {
    id: 'post-2',
    channel: 'general',
    anonIdentityId: 'id-2',
    anonDisplayName: 'Maroon Bear',
    anonAvatarColor: '#6B1D1D',
    textBody: 'Free pizza at the student center at noon. Be there.',
    upvoteCount: 61,
    commentCount: 8,
    createdAt: '2025-03-11T09:00:00Z',
    upvotedByMe: true,
  },
  {
    id: 'post-3',
    channel: 'dating',
    anonIdentityId: 'id-1',
    anonDisplayName: 'Purple Fox',
    anonAvatarColor: '#4A148C',
    textBody: 'Saw someone reading Camus outside Randolph Hall. If that was you, hi.',
    upvoteCount: 88,
    commentCount: 12,
    createdAt: '2025-03-11T08:15:00Z',
    upvotedByMe: false,
  },
  {
    id: 'post-4',
    channel: 'lore',
    anonIdentityId: 'id-2',
    anonDisplayName: 'Maroon Bear',
    anonAvatarColor: '#6B1D1D',
    textBody: 'Rumor is there is an underground tunnel system connecting the old buildings. Has anyone actually found it?',
    upvoteCount: 142,
    commentCount: 31,
    createdAt: '2025-03-10T21:00:00Z',
    upvotedByMe: false,
  },
  {
    id: 'post-5',
    channel: 'lore',
    anonIdentityId: 'id-1',
    anonDisplayName: 'Purple Fox',
    anonAvatarColor: '#4A148C',
    textBody: 'The squirrels on the green are organized. I have seen them hold meetings.',
    upvoteCount: 209,
    commentCount: 44,
    createdAt: '2025-03-10T14:00:00Z',
    upvotedByMe: false,
  },
  {
    id: 'post-6',
    channel: 'dating',
    anonIdentityId: 'id-2',
    anonDisplayName: 'Maroon Bear',
    anonAvatarColor: '#6B1D1D',
    textBody: 'Looking for my study partner from Porter-Gaud. We ended up at the same school somehow.',
    upvoteCount: 47,
    commentCount: 5,
    createdAt: '2025-03-09T16:30:00Z',
    upvotedByMe: false,
  },
];

// ─── Mock comments ────────────────────────────────────────────────────────────

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'post-1',
    anonIdentityId: 'id-2',
    anonDisplayName: 'Maroon Bear',
    anonAvatarColor: '#6B1D1D',
    text: 'Bring a blanket honestly.',
    createdAt: '2025-03-11T10:45:00Z',
  },
  {
    id: 'c-2',
    postId: 'post-1',
    anonIdentityId: 'id-1',
    anonDisplayName: 'Purple Fox',
    anonAvatarColor: '#4A148C',
    text: 'I heard they keep it cold so people do not fall asleep.',
    createdAt: '2025-03-11T11:00:00Z',
  },
  {
    id: 'c-3',
    postId: 'post-4',
    anonIdentityId: 'id-1',
    anonDisplayName: 'Purple Fox',
    anonAvatarColor: '#4A148C',
    text: 'The entrance is supposedly behind a bookshelf in the basement of Towell Library.',
    createdAt: '2025-03-10T21:30:00Z',
  },
];

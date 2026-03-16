import { Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AuthRequest } from '../types';

const supabaseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  // Verify token with Supabase
  const client = createClient(supabaseUrl, anonKey);
  const { data: { user }, error } = await client.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  if (!user.email?.endsWith('@g.cofc.edu')) {
    res.status(403).json({ error: 'Only @g.cofc.edu accounts are permitted' });
    return;
  }

  // Fetch user row from public.users
  const { supabaseAdmin } = await import('../lib/supabase');
  const { data: userRow } = await supabaseAdmin
    .from('users')
    .select('id, email, role, status')
    .eq('id', user.id)
    .single();

  if (!userRow) {
    res.status(403).json({ error: 'User account not found' });
    return;
  }

  if (userRow.status === 'banned' || userRow.status === 'suspended') {
    res.status(403).json({ error: `Account is ${userRow.status}` });
    return;
  }

  req.user = {
    id: userRow.id,
    email: userRow.email,
    role: userRow.role,
    status: userRow.status,
  };

  next();
}

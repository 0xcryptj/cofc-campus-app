import { Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest } from '../types';

// Single persistent client for JWT verification (anon key, not service role)
const supabaseAuth = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  if (!user.email?.endsWith('@g.cofc.edu')) {
    res.status(403).json({ error: 'Only @g.cofc.edu accounts are permitted' });
    return;
  }

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

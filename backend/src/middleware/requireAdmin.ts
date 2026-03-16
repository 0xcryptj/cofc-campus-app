import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

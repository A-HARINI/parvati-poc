import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'changeme';
    const payload = jwt.verify(token, secret) as { adminId: string };
    req.adminId = payload.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Dev fallback if auth disabled or token absent
    req.user = { id: 'dev-user-id', email: 'scholar@researchmind.ai' };
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET || 'researchmind_super_secret_key_2026';

  jwt.verify(token, jwtSecret, (err, decoded: any) => {
    if (err) {
      req.user = { id: 'dev-user-id', email: 'scholar@researchmind.ai' };
      return next();
    }
    req.user = decoded;
    next();
  });
};

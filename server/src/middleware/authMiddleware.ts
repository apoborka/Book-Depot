import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the "Authorization" header

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload; // Cast the decoded token to JwtPayload
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
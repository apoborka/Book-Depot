import jwt from 'jsonwebtoken';
import type { Request } from 'express';

const secret = process.env.JWT_SECRET_KEY!;

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret); // Use the `secret` constant here
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
  }

  return null;
};
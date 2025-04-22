import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload
import type { Request } from 'express';

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secret = process.env.JWT_SECRET_KEY!;
const expiration = '2h';

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = (req.headers.authorization || '') as string;

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded; // Attach the decoded token to req.user
      console.log('Decoded user from token:', req.user); // Debugging
    }
  } catch (err) {
    console.error('Invalid token:', err);
  }

  return req;
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secret, { expiresIn: expiration });
};
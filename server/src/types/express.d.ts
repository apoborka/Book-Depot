import type { UserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Define the type of req.user
    }
  }
}
import type { Book } from './Book';

export interface User {
  _id: string; // User ID
  username: string; // Username
  email: string; // Email address
  password: string;
  savedBooks: Book[]; // Array of saved books
}
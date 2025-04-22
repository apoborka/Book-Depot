import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import axios from 'axios';
import type { JwtPayload } from 'jsonwebtoken';
import type { UserDocument } from '../models/User.js';

interface Context {
  user?: JwtPayload;
}

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return User.findById(context.user._id).select('-password');
    },
    searchBooks: async (_parent: any, { query }: { query: string }) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}`
        );
        console.log('Google Books API response:', response.data);

        return response.data.items.map((book: any) => ({
          bookId: book.id,
          authors: book.volumeInfo.authors || ['No author to display'],
          title: book.volumeInfo.title,
          description: book.volumeInfo.description,
          image: book.volumeInfo.imageLinks?.thumbnail || '',
          link: book.volumeInfo.infoLink || '',
        }));
      } catch (err) {
        console.error('Error in searchBooks resolver:', err);
        throw new Error('Failed to fetch books from Google Books API');
      }
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
    
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password }) as UserDocument;
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
    
      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
    
        return updatedUser;
      } catch (err) {
        console.error('Error in saveBook resolver:', err);
        throw new Error('Failed to save book');
      }
    },
    removeBook: async (_parent: any, { bookId }: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};
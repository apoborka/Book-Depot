import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import type { Request } from 'express';
import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

interface Context extends BaseContext {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

const startServer = async () => {
  // Connect to the database
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

  const app = express();
  const PORT = process.env.PORT || 3001;
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(bodyParser.json());
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const user = authMiddleware({ req });
        return { user };
      },
    })
  );

  // Serve static files from the client build
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Fallback for React Router
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
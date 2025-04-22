import express from 'express';
import type { Request } from 'express';
import 'dotenv/config';
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

  app.use(
    cors({
      origin: 'http://localhost:3000',
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

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
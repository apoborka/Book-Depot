import express from 'express';
import type { Request } from 'express';
import 'dotenv/config';
import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { authMiddleware } from './middleware/authMiddleware.js'; // Corrected path
import cors from 'cors';
import bodyParser from 'body-parser';
import connectToDatabase from './config/connection.js';

interface Context extends BaseContext {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

const startServer = async () => {
  // Connect to the database
  await connectToDatabase();

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
        return { user }; // Pass the decoded user object to the context
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
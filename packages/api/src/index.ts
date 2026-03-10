import dotenv from 'dotenv';

// keep this above all other type/gql imports
import 'reflect-metadata';

import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import { buildSchema } from 'type-graphql';

dotenv.config();

import config from './config';
import { prisma } from './db/prisma';
import seedDb from './db/seed';
import resolvers from './resolvers';

const bootstrap = async () => {
  // Connect to database
  await prisma.$connect();

  if (config.isDev) {
    await seedDb();
  }

  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: true,
  });

  const server = new GraphQLServer({
    schema: schema as any,
    context: {
      prisma,
    },
  });

  /**
   * Add middleware
   */

  server.express.use(cors());

  // must parse body before morganBody as body will be logged
  server.express.use(bodyParser.json());
  // hook morganBody to express app
  morganBody(server.express);

  // options
  const opts = {
    playground: '/playground',
    port: process.env.PORT || 4000,
  };

  server.start(opts, () => {
    console.log(`Server is running on http://localhost:${opts.port}`);
  });
};

bootstrap();

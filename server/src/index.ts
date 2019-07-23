// keep this above all other imports
import 'reflect-metadata';

import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';

// import { startDB } from './db';
import resolvers from './resolvers';

dotenv.config();

// Constants
// const db = startDB({
//   // Add '!' to let TS know it doesn't need to worry about possible undefined vals here
//   db: process.env.DB_NAME!,
//   options: !!process.env.DB_OPTIONS ? process.env.DB_OPTIONS.split('&') : [],
//   pwd: process.env.DB_PWD!,
//   url: process.env.DB_URL!,
//   user: process.env.DB_USER!,
// });

// const server = new GraphQLServer({
//   typeDefs: schema,
//   resolvers,
//   context: {
//     models,
//     db,
//   },
// });

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: true,
  });

  const server = new GraphQLServer({
    schema,
    // context: {
    //   models,
    //   db,
    // },
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
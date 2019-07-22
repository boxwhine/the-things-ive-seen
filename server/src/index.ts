import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import { GraphQLServer } from 'graphql-yoga';
import dotenv from 'dotenv';

import { startDB } from './db';
import models from './db/models';
import resolvers from './graphql/resolvers';
import schema from './graphql/schema';

dotenv.config();

// Constants
const PORT = process.env.PORT || 4000;

const db = startDB({
  db: process.env.DB_NAME,
  options: !!process.env.DB_OPTIONS ? process.env.DB_OPTIONS.split('&') : [],
  pwd: process.env.DB_PWD,
  url: process.env.DB_URL,
  user: process.env.DB_USER,
});

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    db,
  },
});

server.express.use(cors());

// Add logging

// must parse body before morganBody as body will be logged
server.express.use(bodyParser.json());
// hook morganBody to express app
morganBody(server.express);

// options
const opts = {
  playground: '/playground',
  port: PORT,
};

server.start(opts, () => {
  console.log(`Server is running on http://localhost:${opts.port}`);
});

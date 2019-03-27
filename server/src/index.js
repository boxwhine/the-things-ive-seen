const cors = require('cors');
const express = require('express');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { GraphQLServer } = require('graphql-yoga');

const { startDB } = require('./db');
const models = require('./db/models');
const resolvers = require('./graphql/resolvers');

require('dotenv').config();

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
  typeDefs: `${__dirname}/graphql/schema.graphql`,
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

/*
//sessions
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET_KEY,
  })
);

// app.use((req, res, next) => {
//   console.log('## req.session\n', req.session, '\n');
//   return next();
// });
*/

// options
const opts = {
  playground: '/playground',
  port: PORT,
};

server.start(opts, () => {
  console.log(`Server is running on http://localhost:${opts.port}`);
});

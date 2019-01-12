const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session')

require('dotenv').config();

const routes = require('./routes');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

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

// API endpoints
app.use(routes);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session')

require('dotenv').config();

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

// App
const app = express();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

// log HTTP requests
app.use(morgan('combined'));

//sessions
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET_KEY,
  })
);

// app.use((req, res, next) => {
//   console.log('## req.session', req.session);
//   return next();
// });

// API
app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: 'Hello world, Woooooeeeee!!!!'
  };
  res.send(JSON.stringify(data, null, 2));
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

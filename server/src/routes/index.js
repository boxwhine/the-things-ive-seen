const routes = require('express').Router();

const events = require('./events');
const venues = require('./venues');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/events', events);
routes.use('/venues', venues);

module.exports = routes;
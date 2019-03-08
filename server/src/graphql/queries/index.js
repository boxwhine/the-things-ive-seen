const eventQueries = require('./events');
const venueQueries = require('./venues');

module.exports = {
  ...eventQueries,
  ...venueQueries,
};

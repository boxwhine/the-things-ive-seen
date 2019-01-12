const events = require('express').Router();
const all = require('./all');
const byId = require('./byId');

events.get('/', all);
events.get('/:id', byId);

module.exports = events;

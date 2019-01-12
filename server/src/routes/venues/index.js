const venues = require('express').Router();
const all = require('./all');
const byId = require('./byId');

venues.get('/', all);
venues.get('/:id', byId);

module.exports = venues;

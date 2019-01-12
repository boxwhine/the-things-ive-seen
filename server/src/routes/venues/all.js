const db = require('../../common/db');
const errorHandler = require('../../common/utils').errorHandler;
const mapCollection = require('../../common/utils').mapCollection;

const collName = require('./const').VENUES_COLLECTION;

module.exports = async (req, res) => {
  let data = [];
  try {
    const results = await db.collection(collName).get();
    data = mapCollection(results);
  } catch (err) {
    console.error('Error fetching list of venues: ', err);
  }
  res.status(200).json(data);
};
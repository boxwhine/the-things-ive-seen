const db = require('../../common/db');
const errorHandler = require('../../common/utils').errorHandler;

const collName = require('./const').EVENTS_COLLECTION;

module.exports = async (req, res) => {
  let data = null;
  try {
    const doc = await db.collection(collName).doc(req.params.id).get();
    if (doc.exists) {
      data = doc.data();
    }
  } catch (err) {
    console.error(`Error fetching event by id (${req.params.id}): `, err);
  }
  res.status(200).json(data);
};
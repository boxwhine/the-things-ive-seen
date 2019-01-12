const mapCollection = coll => coll.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

const errorHandler = (err) => {
  throw err;
};

module.exports = {
  errorHandler,
  mapCollection,
}
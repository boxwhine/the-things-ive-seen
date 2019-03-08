const purgeVenues = async (parent, args, { models }) => {
  try {
    const deleteAll = await models.Venue.deleteMany({});
    console.log('Deleted all venues...', deleteAll);
    return true;
  } catch (err) {
    throw new Error('Error deleting all venues...', err);
  }
};

module.exports = purgeVenues;

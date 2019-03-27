const purge = async (parent, args, { models }) => {
  try {
    const allVenuesDeleted = await models.Venue.deleteMany({});
    console.log('Deleted all venues...', allVenuesDeleted);
    const allEventsDeleted = await models.Event.deleteMany({});
    console.log('Deleted all events...', allEventsDeleted);
    return true;
  } catch (err) {
    throw new Error('Error deleting all venues/events...', err);
  }
};

module.exports = purge;

const venues = async (parent, args, { models }) => await models.Venue.find({});

module.exports = {
  venues,
};

const events = async (parent, args, { models }) =>
  await models.Event.find({}).populate('venue');

module.exports = {
  events,
};
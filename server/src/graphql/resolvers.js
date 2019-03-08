const resolvers = {
  Query: {
    events: async (parent, args, { models }) =>
      await models.Event.find({}).populate('venue'),
    venues: async (parent, args, { models }) => await models.Venue.find({}),
  },
  Mutation: {
    createVenue: async (parent, { input }, { models }) => {
      const { city, state, name } = input;
      const existingVenue = await models.Venue.findOne({ name });

      if (existingVenue) {
        // @TODO may need to update this as same venue name could exist in different cities, etc.
        throw new Error(`Venue with name "${name}" already exists.`);
      }

      const venue = new models.Venue({ city, state, name });

      try {
        const newVenue = await venue.save();
        console.log('Saved new venue...', newVenue);
        return newVenue;
      } catch (err) {
        throw new Error('Error creating venue...', err);
      }
    },
  },
};

module.exports = resolvers;

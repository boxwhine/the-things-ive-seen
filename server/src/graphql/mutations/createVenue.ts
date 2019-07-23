import { MutationResolvers } from '../types.gen';

const Mutation: MutationResolvers = {
  createVenue: async (parent, args, { models }) => {
    const { name, placeId } = args.input;
    const existingVenue = await models.Venue.findOne({ placeId });

    if (existingVenue) {
      throw new Error(
        `"${name}" venue already exists (Google Place ID: ${placeId})`,
      );
    }

    const venue = new models.Venue({ ...args.input });

    try {
      const newVenue = await venue.save();
      console.log('Saved new venue...', newVenue);
      return newVenue;
    } catch (err) {
      throw new Error('Error creating venue...');
    }
  },
};

export default Mutation.createVenue;

import { MutationResolvers } from '../types.gen';

const mutation: MutationResolvers = {
  createEvent: async (parent, args, { models }) => {
    const {
      date,
      faceValue = 0,
      genre,
      name,
      subGenre = null,
      venue = null,
      wasOpener = false,
    } = args.input;

    const event = new models.Event({
      date,
      faceValue,
      genre,
      name,
      subGenre,
      // @TODO wire up with real venue selection
      venue: venue || '5c84197fcd8448b5102d2eca',
      wasOpener,
    });

    try {
      const newEvent = await event.save();
      console.log('Saved new event...', newEvent);
      return await models.Event.findOne({
        _id: newEvent._id,
      }).populate('venue');
    } catch (err) {
      throw new Error('Error creating event...');
    }
  },
};

export default mutation.createEvent;

import { QueryResolvers } from './types.gen';

const Query: QueryResolvers = {
  events: async (parent, args, { models }) =>
    await models.Event.find({}).populate('venue'),
  venues: async (parent, args, { models }) => await models.Venue.find({}),
};

export default Query;

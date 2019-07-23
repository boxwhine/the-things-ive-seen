import { MutationResolvers } from '../types.gen';

import createVenue from './createVenue';
import createEvent from './createEvent';
import purge from './purge';

const Mutation: MutationResolvers = {
  createEvent,
  createVenue,
  purge,
};

export default Mutation;

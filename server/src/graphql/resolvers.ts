import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime,
} from 'graphql-iso-date';
import { IResolvers } from 'graphql-tools';

import mutations from './mutations';
import queries from './queries';

const resolvers: IResolvers = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
  // custom resolvers
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
};

export default resolvers;

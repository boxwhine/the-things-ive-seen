import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime,
} from 'graphql-iso-date';
 
import { Resolvers } from './types.gen';
import mutations from './mutations';
import queries from './queries';

const resolvers: Resolvers = {
  Query: queries,
  Mutation: mutations,
  // custom resolvers
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
};

export default resolvers;

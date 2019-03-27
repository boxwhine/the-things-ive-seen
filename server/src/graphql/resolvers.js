const {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime,
} = require('graphql-iso-date');
const mutations = require('./mutations');
const queries = require('./queries');

const resolvers = {
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

module.exports = resolvers;

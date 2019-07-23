import gql from 'graphql-tag';

export default gql`
  scalar Date
  scalar DateTime
  scalar Time

  type Query {
    events: [Event]
    venues: [Venue]
  }

  type Mutation {
    createEvent(input: EventInput!): Event
    createVenue(input: VenueInput!): Venue
    purge: Boolean
  }

  input EventInput {
    date: Date!
    faceValue: Float
    genre: String!
    name: String!
    subGenre: String
    venue: ID
    wasOpener: Boolean
  }

  # type Event @entity {
  #   date: Date! @column
  #   faceValue: Float @column
  #   genre: String! @column
  #   id: ID! @id
  #   name: String! @column
  #   subGenre: String @column
  #   venue: Venue @embedded
  #   wasOpener: Boolean @column
  # }

  type Event {
    date: Date! 
    faceValue: Float 
    genre: String! 
    id: ID! 
    name: String! 
    subGenre: String 
    venue: Venue 
    wasOpener: Boolean 
  }

  input VenueInput {
    address: String!
    city: String!
    lat: Float!
    lng: Float!
    name: String!
    placeId: String!
    state: String!
  }

  type Venue {
    address: String!
    city: String!
    id: ID!
    lat: Float!
    lng: Float!
    name: String!
    placeId: String!
    state: String!
  }
`;
import gql from 'graphql-tag';

export type Venue = {
  name: string;
  city: string;
  state: string;
};

export type Event = {
  date: string;
  genre: string;
  id: string;
  name: string;
  subGenre: string;
  venue: Venue;
}

export type Response = {
  events: Event[];
};

export default gql`
  query GetEvents {
    events {
      id
      name
      date
      venue {
        name
        city
        state
      }
      genre
      subGenre
    }
  }
`;

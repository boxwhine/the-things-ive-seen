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
};

export type Response = {
  fetchEvents: Event[];
};

export default gql`
  query GetEvents {
    fetchEvents {
      id
      name
      date
      venue {
        name
        city
        state
      }
      genre {
        name
      }
      subGenre {
        name
      }
    }
  }
`;

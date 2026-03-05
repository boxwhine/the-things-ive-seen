import { gql } from "@apollo/client";

export type Venue = {
  name: string;
  city: string;
  state: string;
};

export type Genre = {
  name: string;
};

export type Event = {
  id: string;
  name: string;
  date: string;
  venue: Venue;
  genre: Genre;
  subGenre: Genre | null;
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

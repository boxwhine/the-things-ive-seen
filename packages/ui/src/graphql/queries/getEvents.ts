import { gql } from "@apollo/client";

export interface Venue {
  name: string;
  city: string;
  state: string;
}

export interface Genre {
  name: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: Venue;
  genre: Genre;
  subGenre: Genre | null;
}

export interface Response {
  fetchEvents: Event[];
}

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

import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const getVenues = gql`
  query getVenues {
    venues {
      id
      name
    }
  }
`;

export default () => (
  <Query query={getVenues}>
    {({ loading, error, data }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      return (
        <ul>
          {data.venues.map(venue => (
            <li key={venue.id}>{venue.name}</li>
          ))}
        </ul>
      );
    }}
  </Query>
);

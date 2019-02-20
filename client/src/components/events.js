import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const getEvents = gql`
  query getEvents {
    events {
      id
      name
    }
  }
`;

export default () => (
  <Query query={getEvents}>
    {({ loading, error, data }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      return (
        <ul>
          {data.events.map(event => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
      );
    }}
  </Query>
);

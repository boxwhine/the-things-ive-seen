import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_EVENTS } from '../graphql/queries';

export default () => (
  <Query query={GET_EVENTS}>
    {({ loading, error, data }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      return (
        <React.Fragment>
          <Link to="/events/new">Add Event...</Link>

          <ul>
            {data.events.map(event => (
              <li key={event.id}>{event.name}</li>
            ))}
          </ul>
        </React.Fragment>
      );
    }}
  </Query>
);

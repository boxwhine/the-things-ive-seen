import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import GET_EVENTS, { Response } from '../graphql/queries/getEvents';

export default () => (
  <Query<Response> query={GET_EVENTS}>
    {({ loading, error, data = {} }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      return (
        <section>
          <h1>Events</h1>

          <Link to="/events/new">Add Event...</Link>

          <ul>
            {(data.fetchEvents || []).map(
              ({ name, id }) => (
                <li key={id}>
                  <span className="event-name">{name}</span> 
                </li>
              )
            )}
          </ul>
        </section>
      );
    }}
  </Query>
);

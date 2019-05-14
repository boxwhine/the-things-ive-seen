import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import get from 'lodash/get';

import GET_EVENTS, { Event, Response } from '../graphql/queries/getEvents';

export default () => (
  <Query<Response> query={GET_EVENTS}>
    {({ loading, error, data }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      const events = get(data, 'events', []).map((event : Event, idx, arr) => (
        <li key={event.id}>{event.name}</li>
      ));
      // const eventItems = get(data, 'events', []).map(({ id, name } : Event) => (
      //   <li key={id}>{name}</li>
      // ));

      return (
        <section>
          <h1>Events</h1>

          <Link to="/events/new">Add Event...</Link>

          <ul>
            {eventItems}
          </ul>
        </section>
      );
    }}
  </Query>
);

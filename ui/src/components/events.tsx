import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import GET_EVENTS from '../graphql/queries/getEvents';

export default () => {
  const { loading, error, data } = useQuery(GET_EVENTS);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h1>Events</h1>

      <Link to="/events/new">Add Event...</Link>

      <ul>
        {data.fetchEvents.map(({ name, id }) => (
          <li key={id}>
            <span className="event-name">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

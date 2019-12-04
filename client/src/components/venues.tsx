import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import GET_VENUES from '../graphql/queries/getVenues';

export default () => {
  const { loading, error, data } = useQuery(GET_VENUES);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h1>Venues</h1>

      <Link to="/venues/new">Add Venue...</Link>

      <ul>
        {data.fetchVenues.map(({ city, id, name, state }) => (
          <li key={id}>
            <span className="venue-name">{name}</span> (
            <span className="venue-location">
              {city}, {state}
            </span>
            )
          </li>
        ))}
      </ul>
    </section>
  );
};

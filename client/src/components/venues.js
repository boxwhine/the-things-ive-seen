import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_VENUES } from '../graphql/queries';

export default () => (
  <Query query={GET_VENUES}>
    {({ loading, error, data }) => {
      if (loading) {
        return <h1>Loading...</h1>;
      }

      if (error) {
        return <div>Error</div>;
      }

      return (
        <React.Fragment>
          <Link to="/venues/new">Add Venue...</Link>

          <ul>
            {data.venues.map(({
              city, id, name, state,
            }) => (
              <li key={id}>
                <span className="venue-name">{name}</span>{' '}
                (<span className="venue-location">{city}, {state}</span>)
              </li>
            ))}
          </ul>
        </React.Fragment>
      );
    }}
  </Query>
);

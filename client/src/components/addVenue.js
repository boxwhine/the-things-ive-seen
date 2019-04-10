import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';

import VenueSearch from './venueSearch';

import { ADD_VENUE } from '../graphql/mutations';
import { GET_VENUES } from '../graphql/queries';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
});

const formContainerStyle = {
  width: '600px',
};

const footerStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
};

const breadcrumbStyle = {
  alignItems: 'center',
  display: 'inline-flex',
};

// we need to update the apollo client cache after adding a new venue
const updateCache = (store, { data: { createVenue: newVenue } }) => {
  const data = store.readQuery({ query: GET_VENUES });
  data.venues.push(newVenue);
  store.writeQuery({
    query: GET_VENUES,
    data,
  });
};

const AddVenue = ({ classes }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleVenueSelect = (place) => {
    setName(place.name);
    setAddress(place.formatted_address);
    setPlaceId(place.place_id);
    setLat(place.geometry.location.lat());
    setLng(place.geometry.location.lng());

    // get city
    const cityObj = place.address_components.find(x => x.types.includes('locality'));
    setCity(cityObj.short_name);

    // get state
    const stateObj = place.address_components.find(x => x.types.includes('administrative_area_level_1'));
    setState(stateObj.short_name);
  };

  return (
    <Mutation
      mutation={ADD_VENUE}
      update={updateCache}
      variables={{
        address, city, lat, lng, name, state, placeId,
      }}
    >
      {(createVenue, { loading, error, data }) => {
        if (loading) {
          return <h1>Loading...</h1>;
        }

        if (error) {
          return <div>Error</div>;
        }

        if (get(data, 'createVenue.id')) {
          return <h2>New venue "{get(data, 'createVenue.name')}" created.</h2>;
        }

        return (
          <React.Fragment>
            <Link to="/venues" style={breadcrumbStyle}><ArrowBack fontSize="inherit" />Back to Venues page</Link>

            <section>
              <header>
                <h1>Add a new venue</h1>
              </header>

              <form>
                <Grid
                  container
                  direction="row"
                  spacing={16}
                  style={formContainerStyle}
                >
                  <Grid item xs={12}>
                    <VenueSearch onVenueSelect={handleVenueSelect} />
                  </Grid>

                  <Grid item xs={12}>
                    <nav style={footerStyle}>
                      <Button
                        className={classes.button}
                        color="primary"
                        disabled={!(name && city && state)}
                        onClick={createVenue}
                        size="small"
                        variant="contained"
                      >
                        Save
                      </Button>

                      <Button
                        className={classes.button}
                        component={Link}
                        size="small"
                        to="/venues"
                        variant="contained"
                      >
                        Cancel
                      </Button>
                    </nav>
                  </Grid>
                </Grid>
              </form>
            </section>
          </React.Fragment>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(AddVenue);

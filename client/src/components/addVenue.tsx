import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';

import ADD_VENUE from '../graphql/mutations/addVenue';
import GET_VENUES, { Response } from '../graphql/queries/getVenues';

import VenueSearch from './venueSearch';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginLeft: spacing.unit,
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

interface Variables {
  address: string;
  city: string;
  lat: number;
  lng: number;
  name: string;
  placeId: string;
  state: string;
};

const AddVenue = ({ classes }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [lat, setLat] = useState(-1);
  const [lng, setLng] = useState(-1);

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
    <Mutation<Response, Variables>
      mutation={ADD_VENUE}
      // update venues in client cache, post-mutate
      refetchQueries={() => [{ query: GET_VENUES }]}
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
          <>
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
          </>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(AddVenue);

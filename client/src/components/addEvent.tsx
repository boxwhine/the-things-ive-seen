import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';

import { ADD_EVENT } from '../graphql/mutations';
import { GET_VENUES } from '../graphql/queries';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
});

const formContainerStyle = {
  maxWidth: '40%',
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

const AddEvent = ({ classes }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <Mutation
      mutation={ADD_EVENT}
      update={updateCache}
      variables={{ city, name, state }}
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
            <Link to="/events" style={breadcrumbStyle}><ArrowBack fontSize="inherit" />Back to Events page</Link>

            <section>
              <header>
                <h1>Add a new venue</h1>
              </header>
              <form>
                <Grid
                  container
                  direction="column"
                  style={formContainerStyle}
                >
                  <TextField
                    id="venue-name"
                    label="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                  />

                  <TextField
                    id="venue-city"
                    label="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    margin="normal"
                  />

                  <TextField
                    id="venue-state"
                    label="State"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    margin="normal"
                  />

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
                      to="/events"
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </nav>
                </Grid>
              </form>
            </section>
          </>
        );
      }}
    </Mutation>
  );
};

export default withStyles(styles)(AddEvent);

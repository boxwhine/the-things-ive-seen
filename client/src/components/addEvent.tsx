import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';

import ADD_EVENT from '../graphql/mutations/addEvent';
import GET_EVENTS, { Response } from '../graphql/queries/getEvents';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginLeft: spacing.unit,
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

interface Variables {
  city: string;
  name: string;
  state: string;
};

// we need to update the apollo client cache after adding a new venue
const updateCache = (store, { data: { createVenue: newVenue } }) => {
  const data = store.readQuery({ query: GET_EVENTS });
  data.venues.push(newVenue);
  store.writeQuery({
    query: GET_EVENTS,
    data,
  });
};

const AddEvent = ({ classes }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <Mutation<Response, Variables>
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

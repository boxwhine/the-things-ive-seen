import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';

import ADD_EVENT from '../graphql/mutations/addEvent';
import GET_EVENTS, { Response } from '../graphql/queries/getEvents';

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  button: {
    marginLeft: theme.spacing,
  },
  formContainer: {
    maxWidth: '40%',
  },
  footer: {
    display: 'flex',
    // flexDirection: 'row-reverse',
  },
}));

interface Variables {
  city: string;
  name: string;
  state: string;
};

const AddEvent = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <Mutation<Response, Variables>
      mutation={ADD_EVENT}
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
            <Link to="/events" className={classes.breadcrumb}><ArrowBack fontSize="inherit" />Back to Events page</Link>

            <section>
              <header>
                <h1>Add a new venue</h1>
              </header>
              <form>
                <Grid
                  className={classes.formContainer}
                  container
                  direction="column"
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

                  
                  <nav className={classes.footer}>
                    <Button
                      className={classes.button}
                      color="primary"
                      disabled={!(name && city && state)}
                      onClick={(e) => createVenue({})}
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

export default AddEvent;

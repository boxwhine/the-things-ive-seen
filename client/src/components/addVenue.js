import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ADD_VENUE } from '../grqphql/mutations';

const formContainerStyle = {
  maxWidth: '40%',
};

const footerStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
};

export default () => {
  // Init form state variables
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  return (
    <Mutation mutation={ADD_VENUE} variables={{ city, name, state }}>
      {(createVenue, { loading, error, data }) => {
        if (loading) {
          return <h1>Loading...</h1>;
        }

        if (error) {
          return <div>Error</div>;
        }

        if (get(data, 'createVenue.id')) {
          return (
            <div>
              <h2>New venue "{get(data, 'createVenue.name')}" created.</h2>

              <p><Link to="/venues/new">Create another?</Link></p>
            </div>
          );
        }

        return (
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
                    color="primary"
                    disabled={!(name && city && state)}
                    onClick={createVenue}
                    size="small"
                    variant="contained"
                  >
                    Save
                  </Button>

                  <Button
                    component={Link}
                    size="small"
                    to="/venues"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </nav>
              </Grid>
            </form>
          </section>
        );
      }}
    </Mutation>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';

export default withRouter(() => (
  <header>
    <nav>
      <Button component={NavLink} to="/">
        Home
      </Button>
      <Button component={NavLink} to="/about-us">
        About
      </Button>
      <Button component={NavLink} to="/venues">
        Venues
      </Button>
      <Button component={NavLink} to="/events">
        Events
      </Button>
    </nav>
  </header>
));

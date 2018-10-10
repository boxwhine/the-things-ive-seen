import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default () => (
  <header>
    <Button component={Link} to="/">
      Home
    </Button>
    <Button component={Link} to="/about-us">
      About
    </Button>
  </header>
);

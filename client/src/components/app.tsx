import React from 'react';
import { Route, Switch } from 'react-router-dom';

import About from './about';
import AddEvent from './addEvent';
import AddVenue from './addVenue';
import Events from './events';
import Home from './home';
import Nav from './nav';
import Venues from './venues';

const App = () => (
  <>
    <Nav />

    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
        <Route exact path="/events" component={Events} />
        <Route exact path="/events/new" component={AddEvent} />
        <Route exact path="/venues" component={Venues} />
        <Route exact path="/venues/new" component={AddVenue} />
      </Switch>
    </main>
  </>
);

export default App;

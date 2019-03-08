import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Nav from './nav';
import Home from './home';
import About from './about';
import Events from './events';
import Venues from './venues';

const App = () => (
  <React.Fragment>
    <Nav />

    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
        <Route exact path="/events" component={Events} />
        <Route exact path="/venues" component={Venues} />
      </Switch>
    </main>
  </React.Fragment>
);

export default App;
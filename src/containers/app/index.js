import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../home';
import About from '../about';
import Nav from '../../common/nav';

const App = () => (
  <React.Fragment>
    <Nav />

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
    </main>
  </React.Fragment>
);

export default App;

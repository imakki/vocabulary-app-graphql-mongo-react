import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Card from './components/Card';
import Home from './components/Home';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/card/:id" component={Card} />
    </Switch>
  );
}

export default App;

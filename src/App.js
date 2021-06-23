import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import './App.css';
import ListPage from './ListPage';
import CreatePage from './CreatePage';
import DetailPage from './DetailPage';

export default class App extends React.Component { 
  render() {
    return (
      <Router>
        <div>
          <h2>My cool board games</h2>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/create">Add game</Link>
          </p>
          <Switch>
            <Route path="/" exact render={(routerProps) => <ListPage {...routerProps} />} /> 
            <Route path="/games/:id" exact render={(routerProps) => <DetailPage {...routerProps} />} />
            <Route path="/create" exact render={(routerProps) => <CreatePage {...routerProps} />} />          
          </Switch>
        </div>
      </Router>
    );
  }
}
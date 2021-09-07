import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Home from './containers/Home';
import Issues from './containers/Issues';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/issues/:owner/:repo">
            <Issues />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

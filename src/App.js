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
    <>
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
    </>
  );
}

export default App;

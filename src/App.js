import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  EuiPage,
} from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_amsterdam_light.css';

import './App.css';

import Game from './Game';


function App() {

  return (
    <EuiPage className="App">
      <Router>
        <Switch>
          <Route path="/david">
            <Game player="David" />
          </Route>
          <Route path="/kris">
            <Game player="Kris" />
          </Route>
          <Route path="/">
            <Game player="" />
          </Route>
        </Switch>
      </Router>
    </EuiPage>
  );
}

export default App;

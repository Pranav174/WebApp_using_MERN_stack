import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import root from "./components/root"
import login from "./components/login"
import logout from "./components/logout"

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path='/' component={root} />
          <Route path='/login' component={login} />
          <Route path='/logout' component={logout} />
        </div>
      </Router>
    );
  }
}

export default App;

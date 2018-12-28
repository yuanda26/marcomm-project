import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { CURRENT_USER } from "./actions/types";
import store from "./store";
import jwt_decode from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// Private Route
import PrivateRoute from "./PrivateRoute";
// Layout Components
import Navbar from "./components/layout/Navbar";

// Import Components
import Dashboard from "./Dashboard";
import Login from "./components/content/users/Login";
import DesignAdd from "./components/content/design/DesignAdd";
import DesignList from "./components/content/design/DesignList";
import DesignView from "./components/content/design/DesignView";
import DesignEdit from "./components/content/design/DesignEdit";
import SouvenirList from "./components/content/souvenir/SouvenirList";
import UnitList from "./components/content/unit/UnitList";
import EmployeeList from "./components/content/employee/ListEmployee";
import ListEvent from "./components/content/event/ListEvent";

// Check for Token
if (localStorage.token) {
  // Decode Token and Get User Info and Expiration
  const decoded = jwt_decode(localStorage.token);
  // Remove Password Property
  delete decoded.password;
  // Set User and Authenticated
  store.dispatch({
    type: CURRENT_USER,
    payload: decoded
  });
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/design" component={DesignList} />
              <PrivateRoute exact path="/design/add" component={DesignAdd} />
              <PrivateRoute exact path="/employee" component={EmployeeList} />
              <PrivateRoute exact path="/tevent" component={ListEvent} />
              <PrivateRoute
                exact
                path="/design/view/:code"
                component={DesignView}
              />
              <PrivateRoute
                exact
                path="/design/edit/:code"
                component={DesignEdit}
              />
              <PrivateRoute exact path="/souvenir" component={SouvenirList} />
              <PrivateRoute exact path="/unit" component={UnitList} />
              <PrivateRoute exact path="/employee" component={EmployeeList} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

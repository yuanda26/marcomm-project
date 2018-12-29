import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { CURRENT_USER } from "./actions/types";
import store from "./store";
import jwt_decode from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
// Private Route
import RouteSwitcher from "./RouteSwitcher";
import PrivateRoute from "./PrivateRoute";
// Layout Components
import Login from "./components/content/users/Login";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

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
            <RouteSwitcher />
            {/* <Sidebar /> */}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

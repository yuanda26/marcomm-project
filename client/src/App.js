import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { CURRENT_USER } from "./actions/types";
import store from "./store";
import jwt from "jsonwebtoken";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
// Private Route
import RouteSwitcher from "./RouteSwitcher";
// Layout Components
import Navbar from "./components/layout/Navbar";
import Login from "./components/content/users/Login";
import Forgot from "./components/content/users/ForgotPassword";
// Config File
import AuthConfig from "./config/Auth_Config.json";
// Error Boundary
import ErrorBoundary from "./ErrorBoundary";

// Check for Token
if (localStorage.token) {
  // Verify Token Expiration
  jwt.verify(localStorage.token, AuthConfig.secretKey, (err, decoded) => {
    if (err) {
      localStorage.clear();
      // Set Current User to {}
      // Which will Set isAuthenticated to False
      store.dispatch({
        type: CURRENT_USER,
        payload: {}
      });
      window.location.href = "/";
    } else {
      // Remove Password Property
      delete decoded.password;
      // Set User and Authenticated
      store.dispatch({
        type: CURRENT_USER,
        payload: decoded
      });
    }
  });
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ErrorBoundary>
            <div className="App">
              <Navbar />
              <Route exact path="/" component={Login} />
              <Route exact path="/forgot_password" component={Forgot} />
              <RouteSwitcher />
            </div>
          </ErrorBoundary>
        </Router>
      </Provider>
    );
  }
}

export default App;

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { CURRENT_USER } from "./actions/types";
import store from "./store";
import jwt from "jsonwebtoken";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// Private Route
import PrivateRoute from "./PrivateRoute";
// Layout Components
import Navbar from "./components/layout/Navbar";
<<<<<<< HEAD

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
import ListProduct from "./components/content/product/listProduct";
=======
import Forgot from "./components/content/users/ForgotPassword";
// Config File
import AuthConfig from "./config/Auth_Config.json";
>>>>>>> 8fc312c78a7e0f4ac4be8b449008e9eb6311bb75

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
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/design" component={DesignList} />
              <PrivateRoute exact path="/design/add" component={DesignAdd} />
              <PrivateRoute exact path="/event" component={ListEvent} />
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
              <PrivateRoute exact path="/product" component={ListProduct} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

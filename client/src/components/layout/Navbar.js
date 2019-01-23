import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Redux Actions
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authAction";

class Navbar extends Component {
  // Logout Function
  onLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    // Define Links
    const authLinks = (
      <Fragment>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <Link
              to="#"
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Master
            </Link>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link to="#" className="dropdown-item">
                Action
              </Link>
              <Link to="#" className="dropdown-item">
                Another action
              </Link>
              <div className="dropdown-divider" />
              <Link to="#" className="dropdown-item">
                Something else here
              </Link>
            </div>
          </li>
          <li className="nav-item dropdown">
            <Link
              to="#"
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Transaction
            </Link>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link to="#" className="dropdown-item">
                Action
              </Link>
              <Link to="#" className="dropdown-item">
                Another action
              </Link>
              <div className="dropdown-divider" />
              <Link to="#" className="dropdown-item">
                Something else here
              </Link>
            </div>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="" onClick={this.onLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </Fragment>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Marcomm
          </Link>
          <div className="collapse navbar-collapse" id="mobile-nav">
            {isAuthenticated ? authLinks : ""}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);

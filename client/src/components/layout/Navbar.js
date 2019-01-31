import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// Redux Actions
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authAction";
import { getAllMenu } from "../../actions/menuActions";
import { getListAccess } from "../../actions/accessMenuActions";
import { getEmployeeId } from "../../actions/employeeAction";
// Validation
import isEmpty from "../../validation/isEmpty";

class Navbar extends Component {
  state = {
    masterMenu: [],
    transactionMenu: []
  };

  componentDidMount() {
    if (this.props.auth.user.m_role_id !== undefined) {
      this.props.getAllMenu();
      this.props.getListAccess(this.props.auth.user.m_role_id);
      this.props.getEmployeeId(this.props.auth.user.m_employee_id);
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    let master = [];
    let transaction = [];
    props.accessData.dataAccess.forEach(access => {
      props.menuData.menuArr.forEach(menu => {
        if (
          menu.controller !== false &&
          menu.controller === access &&
          menu.parent_id === "ME0006"
        ) {
          master.push(menu);
        } else if (
          menu.controller !== false &&
          menu.controller === access &&
          menu.parent_id === "ME0011"
        ) {
          transaction.push(menu);
        }
      });
    });

    this.setState({
      masterMenu: master,
      transactionMenu: transaction
    });
  }

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
        <ul className="navbar-nav mr-auto">
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
              {this.state.masterMenu.length === 0 ? (
                <div>You can't access Master Menu</div>
              ) : (
                this.state.masterMenu.map((content, index) => (
                  <a
                    className="dropdown-item"
                    key={index.toString()}
                    href={content.controller}
                  >
                    {content.name}
                  </a>
                ))
              )}
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
              {this.state.transactionMenu.length === 0 ? (
                <div>You can't access Transaction Menu</div>
              ) : (
                this.state.transactionMenu.map((content, index) => (
                  <a
                    className="dropdown-item"
                    key={index.toString()}
                    href={content.controller}
                  >
                    {content.name}
                  </a>
                ))
              )}
            </div>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {!isEmpty(this.props.employee) && (
            <li className="nav-item active">
              <Link className="nav-link" to="#">
                Welcome,{" "}
                {this.props.employee.first_name +
                  " " +
                  this.props.employee.last_name}
              </Link>
            </li>
          )}
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
  auth: PropTypes.object.isRequired,
  menuData: PropTypes.object.isRequired,
  accessData: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  getAllMenu: PropTypes.func.isRequired,
  getListAccess: PropTypes.func.isRequired,
  getEmployeeId: PropTypes.func.isRequired,
  employee: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  menuData: state.menu,
  accessData: state.accessMenuData,
  employee: state.employee.myEmployeeId
});

export default connect(
  mapStateToProps,
  { logoutUser, getAllMenu, getListAccess, getEmployeeId }
)(Navbar);

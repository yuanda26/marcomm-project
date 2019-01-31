import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../../../actions/authAction";
import TextField from "../../common/TextField";
import isEmpty from "../../../validation/isEmpty";

class Login extends Component {
  state = {
    username: "",
    password: "",
    errorUsername: "",
    errorPassword: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // React Lifecycle Method Component
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.auth.isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }

  onSubmit = e => {
    e.preventDefault();

    if (isEmpty(this.state.username)) {
      this.setState({ errorUsername: "This Field is Required!" });
    }
    if (isEmpty(this.state.password)) {
      this.setState({ errorPassword: "This Field is Required!" });
    }

    // Final Validation
    if (!isEmpty(this.state.username) && !isEmpty(this.state.password)) {
      const userData = {
        username: this.state.username,
        password: this.state.password
      };

      // Login
      this.props.loginUser(userData);
      this.setState({ errorUsername: "", errorPassword: "" });
    }
  };

  render() {
    const { errors } = this.props.auth;

    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-5 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">
                  Sign in to your Marcomm Account
                </p>
                {errors !== null && (
                  <div className="alert alert-danger">{errors.message}</div>
                )}
                <form onSubmit={this.onSubmit}>
                  <TextField
                    placeholder="*Username"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChange}
                    errors={this.state.errorUsername}
                  />
                  <TextField
                    placeholder="*Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    errors={this.state.errorPassword}
                  />
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                  <div className="text-center">
                    Forgot Password? Reset
                    <Link to="/forgot_password"> Here.</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);

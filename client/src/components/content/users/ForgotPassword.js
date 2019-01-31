import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ForgotPassword } from "../../../actions/authAction";
// Form Components
import TextField from "../../common/TextField";
import isEmpty from "../../../validation/isEmpty";

class Forgot extends React.Component {
  state = {
    username: "",
    password: "",
    repeat: "",
    errorUsername: "",
    errorPassword: "",
    errorRepeat: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    // Form Validation
    if (isEmpty(this.state.username)) {
      this.setState({ errorUsername: "This Field is Required!" });
    }
    if (isEmpty(this.state.password)) {
      this.setState({ errorPassword: "This Field is Required!" });
    }
    if (isEmpty(this.state.repeat)) {
      this.setState({ errorRepeat: "This Field is Required!" });
    }
    if (this.state.password !== this.state.repeat) {
      this.setState({ errorRepeat: "Password Didn't Match!" });
    }

    // Final Validation
    if (
      !isEmpty(this.state.username) &&
      !isEmpty(this.state.password) &&
      !isEmpty(this.state.repeat) &&
      this.state.password === this.state.repeat
    ) {
      const formdata = {
        username: this.state.username,
        password: this.state.password
      };
      this.props.ForgotPassword(formdata);
      // Clear Form
      this.setState({
        username: "",
        password: "",
        repeat: "",
        errorUsername: "",
        errorPassword: "",
        errorRepeat: ""
      });
    }
  };

  render() {
    const { status, message } = this.props.auth;

    return (
      <div className="landing-inner">
        <div className="container">
          <div className="row">
            <div className="col-md-5 m-auto">
              <h1 className="display-4 text-center">Reset Password</h1>
              <p className="lead text-center">Reset your Password Account</p>
              {status === 404 && (
                <div className="alert alert-danger">{message}</div>
              )}
              {status === 200 && (
                <div className="alert alert-danger">{message}</div>
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
                  type="password"
                  placeholder="*Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  errors={this.state.errorPassword}
                />
                <TextField
                  type="password"
                  placeholder="*Repeat Password"
                  name="repeat"
                  value={this.state.repeat}
                  onChange={this.onChange}
                  errors={this.state.errorRepeat}
                />
                <input
                  type="submit"
                  className="btn btn-info btn-block mt-4"
                  value="Reset"
                />
                <div className="text-center">
                  Remember Password? Back to
                  <Link to="/"> Login.</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Forgot.propTypes = {
  ForgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { ForgotPassword }
)(Forgot);

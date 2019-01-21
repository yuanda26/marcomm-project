import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4 mt-4">
                  Sorry.{" "}
                  <span className="font-weight-bold text-danger">
                    Something went wrong!
                  </span>
                </h1>
                <a href="/dashboard">
                  <button className="btn btn-primary mt-2">Back to Home</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

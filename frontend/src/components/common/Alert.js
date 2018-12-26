import React, { Component } from "react";

export default class Alert extends Component {
  render() {
    console.log(this.props.message);
    return (
      <div
        className={`alert alert-warning alert-dismissible fade`}
        role="alert"
      >
        <strong>Holy guacamole!</strong> You should check in on some of those
        fields below.
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={this.props.closeAlert}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

import React from "react";
import PropTypes from "prop-types";

const Alert = ({ alert, action, message, data, onClick }) => {
  return (
    <div className="action-alert">
      <div
        className={`alert alert-${alert} alert-dismissible show`}
        role="alert"
      >
        <strong>{action}</strong> {message}{" "}
        {data && (
          <span>
            with code <strong>{data}</strong>
          </span>
        )}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={onClick}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  alert: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  data: PropTypes.string,
  onClick: PropTypes.func
};

Alert.defaultProps = {
  alert: "success"
};

export default Alert;

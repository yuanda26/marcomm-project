import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const FileField = ({ name, id, onChange, errors }) => {
  return (
    <div>
      <div className="custom-file">
        <input
          type="file"
          name={name}
          id={id}
          className={classnames(`custom-file-input`, {
            "is-invalid": errors
          })}
          onChange={onChange}
          errors={errors}
        />
        <label className="custom-file-label" htmlFor="customFile" />
      </div>
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

FileField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string.isRequired
};

export default FileField;

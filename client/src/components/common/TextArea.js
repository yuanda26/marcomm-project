import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextArea = ({
  label,
  name,
  placeholder,
  cols,
  rows,
  value,
  onChange,
  disabled,
  errors,
  maxLength
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <textarea
        className={classnames("form-control", {
          "is-invalid": errors
        })}
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
      />
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  cols: PropTypes.string,
  rows: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  maxLength: PropTypes.string,
  errors: PropTypes.string
};

TextArea.defaultProps = {
  cols: "30",
  rows: "5",
  maxLength: "255"
};

export default TextArea;

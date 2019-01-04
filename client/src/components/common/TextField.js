import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextField = ({
  label,
  name,
  placeholder,
  value,
  type,
  disabled,
  readOnly,
  onChange,
  errors,
  min,
  max,
  maxLength
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        className={classnames("form-control", {
          "is-invalid": errors
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
      />
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.string
};

TextField.defaultProps = {
  type: "text",
  disabled: false
};

export default TextField;

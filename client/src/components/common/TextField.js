import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextField = ({
  label,
  id,
  className,
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
        id={id}
        type={type}
        className={classnames(`form-control ${className}`, {
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
        maxLength={maxLength}
      />
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  maxLength: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.string
};

TextField.defaultProps = {
  type: "text",
  disabled: false,
  readOnly: false,
  maxLength: "50"
};

export default TextField;

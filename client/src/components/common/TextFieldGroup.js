import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextFieldGroup = ({
  label,
  name,
  placeholder,
  value,
  type,
  disabled,
  onChange,
  errors,
  maxLength
}) => {
  return (
    <div className="form-group row">
      {label && (
        <label className="col-sm-4 col-form-label text-right">{label}</label>
      )}
      <div className="col-sm-8">
        <input
          type={type}
          className={classnames("form-control", {
            "is-invalid": errors
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          maxLength={maxLength}
        />
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};

TextFieldGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  maxLength: PropTypes.string,
  errors: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text",
  disabled: false,
  maxLength: "50"
};

export default TextFieldGroup;

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextAreaGroup = ({
  label,
  id,
  className,
  name,
  placeholder,
  cols,
  rows,
  value,
  maxLength,
  minLength,
  onChange,
  disabled,
  errors
}) => {
  return (
    <div className="form-group row">
      {label && (
        <label className="col-sm-4 col-form-label text-left">{label}</label>
      )}
      <div className="col-sm-8">
        <textarea
          id={id}
          className={classnames(`form-control ${className}`, {
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
          minLength={minLength}
        />
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};

TextAreaGroup.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  cols: PropTypes.string,
  rows: PropTypes.string,
  maxLength: PropTypes.string,
  minLength: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.string
};

TextAreaGroup.defaultProps = {
  cols: "30",
  rows: "3",
  maxLength: "255"
};

export default TextAreaGroup;

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextArea = ({
  label,
  id,
  className,
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
      />
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  cols: PropTypes.string,
  rows: PropTypes.string,
  maxLength: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  errors: PropTypes.string
};

TextArea.defaultProps = {
  cols: "30",
  rows: "5",
  maxLength: "255"
};

export default TextArea;

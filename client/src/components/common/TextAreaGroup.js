import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const TextAreaGroup = ({
  label,
  name,
  placeholder,
  cols,
  rows,
  value,
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
        />
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};

TextAreaGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  cols: PropTypes.string,
  rows: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  errors: PropTypes.string
};

TextAreaGroup.defaultProps = {
  cols: "30",
  rows: "5"
};

export default TextAreaGroup;

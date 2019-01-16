import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const SelectList = ({
  label,
  className,
  id,
  name,
  value,
  onChange,
  options,
  errors,
  disabled
}) => {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select
        id={id}
        className={classnames(`form-control ${className}`, {
          "is-invalid": errors
        })}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {selectOptions}
      </select>
      {errors && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};

SelectList.propTypes = {
  options: PropTypes.array.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  errors: PropTypes.string
};

export default SelectList;

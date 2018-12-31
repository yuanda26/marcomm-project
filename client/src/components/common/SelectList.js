import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const SelectList = ({
  label,
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
        className={classnames("form-control", {
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
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  errors: PropTypes.string
};

export default SelectList;

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const SelectListGroup = ({
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
    <div className="form-group row">
      <label className="col-sm-4 col-form-label text-left">{label}</label>
      <div className="col-sm-8">
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
    </div>
  );
};

SelectListGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  errors: PropTypes.string
};

export default SelectListGroup;

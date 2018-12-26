import React from "react";
import PropTypes from "prop-types";

const TextArea = ({ label, name, placeholder, value, onChange, disabled }) => {
  return (
    <div className="form-group row">
      <label className="col-sm-4 col-form-label text-right">{label}</label>
      <div className="col-sm-8">
        <textarea
          className="form-control"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string
};

export default TextArea;

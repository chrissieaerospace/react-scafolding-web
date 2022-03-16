import React from "react";
import "./styles.scss";
import PropTypes from "prop-types";

const RadioButton = ({
  id,
  disabled,
  classname,
  checked,
  onChange,
  name,
  buttonText,
  value,
  inputProps
}) => (
  //  disabled classname = RadioButtondisabled
  <div className={`radioButton ${classname}`}>
    <label className="btn-container">
      <input
        type="radio"
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        name={name}
      />
      <span className="checkmark" />
      {buttonText}
    </label>
  </div>
);

RadioButton.defaultProps = {
  disabled: false
};
RadioButton.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  classname: PropTypes.string,
  checked: PropTypes.bool,
  onChanage: PropTypes.func,
  name: PropTypes.string,
  buttonText: PropTypes.string
};
export default RadioButton;

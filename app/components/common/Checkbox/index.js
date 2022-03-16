import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const CheckBox = ({ id, children, disabled, classname, checked, onChange }) => (
  //  disabled classname = checkboxdisabled
  <div className={`checkbox ${classname}`} key={id}>
    <input
      type="checkbox"
      id={id}
      disabled={disabled}
      checked={checked}
      onChange={e => {
        if (!disabled) onChange(e.target.checked);
      }}
    />
    <label htmlFor={id}>{children}</label>
  </div>
);

CheckBox.defaultProps = {
  disabled: false,
};
CheckBox.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  classname: PropTypes.string,
  children: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
export default CheckBox;

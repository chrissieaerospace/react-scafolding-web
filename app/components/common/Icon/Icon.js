import React from "react";
import PropTypes from "prop-types";
import "./Icon.scss";
import "../../styles/stylesheet.scss";

const IconComponent = ({ icon, color, size, onClick, transform }) => (
  <a onClick={onClick}>
    <span
      className="iconify"
      data-icon={icon}
      data-inline="false"
      style={{
        color: color ? color : "#656d7a",
        // color: "red",
        height: size ? size : "18px",
        width: size ? size : "18px",
        transform: `${transform} !important`
        // opacity: onHover || active ? 1 : 0.5,
      }}
    />
  </a>
);
IconComponent.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.any,
  color: PropTypes.string,
  onClick: PropTypes.func,
  transform: PropTypes.string
};

export default IconComponent;

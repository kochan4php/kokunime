import PropTypes from "prop-types";
import { memo } from "react";

const CardLink = ({ children, px, py, fontsize, centerText }) => (
  <a
    className={`text-white group-hover:text-teal-300 tracking-wide transition-colors duration-300 selection:bg-teal-500 selection:text-teal-800 block font-semibold ${fontsize} ${px} ${py} ${
      centerText ? "text-center" : ""
    }`}
  >
    {children}
  </a>
);

CardLink.propTypes = {
  children: PropTypes.node.isRequired,
  px: PropTypes.string,
  py: PropTypes.string,
  fontSize: PropTypes.string,
  centerText: PropTypes.bool,
};

export default memo(CardLink);

import PropTypes from "prop-types";
import { memo } from "react";

const TitleSection = ({ children, centerText }) => (
  <h1
    className={`text-sky-300 font-bold text-2xl md:text-3xl lg:text-4xl selection:bg-teal-500 selection:text-teal-900 ${
      centerText ? "text-center" : ""
    }`}
  >
    {children}
  </h1>
);

TitleSection.propTypes = {
  centerText: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default memo(TitleSection);

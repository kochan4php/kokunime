import { memo } from "react";
import PropTypes from "prop-types";

const Button = ({ children, onClick, bgcolor, width, circle, ...another }) => (
  <button
    className={`px-1 py-1.5 ${
      circle ? "rounded-full" : "rounded"
    } text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base md:text-lg font-semibold ${bgcolor} ${width} h-full`}
    onClick={onClick}
    {...another}
  >
    {children}
  </button>
);

Button.defaultProps = {
  bgcolor: "bg-slate-900",
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  bgcolor: PropTypes.string,
  width: PropTypes.string,
};

export default memo(Button);

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const RenderAfter = ({ delay, children }) => {
  const [onReady, setOnReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOnReady(true), delay);
    return () => clearTimeout(timer);
  }, []);

  return onReady ? children : null;
};

RenderAfter.propTypes = {
  delay: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default RenderAfter;

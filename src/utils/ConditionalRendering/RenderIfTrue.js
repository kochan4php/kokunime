import PropTypes from "prop-types";

const RenderIfTrue = ({ children, isTrue }) => (isTrue ? children : null);

RenderIfTrue.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RenderIfTrue;

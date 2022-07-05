import PropTypes from "prop-types";

const RenderIfFalse = ({ children, isFalse }) => (isFalse ? null : children);

RenderIfFalse.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RenderIfFalse;

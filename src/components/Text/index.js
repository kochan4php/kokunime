import PropTypes from "prop-types";

const Text = ({ children, category }) => (
  <p className="text-base md:text-lg">
    <span className="font-semibold my-0.5 inline-block">
      {category}&nbsp;:&nbsp;
    </span>
    {children}
  </p>
);

Text.propTypes = {
  children: PropTypes.node.isRequired,
  category: PropTypes.string.isRequired,
};

export default Text;

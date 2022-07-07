import PropTypes from "prop-types";

const Text = ({ children, category }) => (
  <div className="text-base md:text-lg 2xl:text-xl ">
    <span className="font-semibold my-1 inline-block">
      {category}&nbsp;:&nbsp;
    </span>
    <p className="inline">{children}</p>
  </div>
);

Text.propTypes = {
  children: PropTypes.node.isRequired,
  category: PropTypes.string.isRequired,
};

export default Text;

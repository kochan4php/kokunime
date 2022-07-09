import PropTypes from "prop-types";
import { memo } from "react";

const CardImage = ({ src, alt, className }) => (
  <img src={src} alt={alt} width="100%" heigth="100%" className={className} />
);

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default memo(CardImage);

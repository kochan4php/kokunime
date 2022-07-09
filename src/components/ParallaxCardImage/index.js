import PropTypes from "prop-types";
import { memo } from "react";
import CardImage from "../CardImage";

const ParallaxCardImage = ({ image, alt }) => (
  <div className="rounded">
    <CardImage
      src={image}
      alt={alt}
      width="100%"
      height="100%"
      className="rounded selection:bg-pink-500"
    />
  </div>
);

ParallaxCardImage.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default memo(ParallaxCardImage);

import PropTypes from "prop-types";
import { memo } from "react";

const ParallaxImage = ({ image, alt }) => (
  <div className="flex justify-center">
    <img
      src={image}
      alt={alt}
      className="rounded shadow shadow-slate-800 w-[100%]"
    />
  </div>
);

ParallaxImage.propTypes = {
  image: PropTypes.string,
  alt: PropTypes.string,
};

export default memo(ParallaxImage);

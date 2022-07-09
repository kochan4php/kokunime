import { memo } from "react";
import PropTypes from "prop-types";
import Card from "../Card";
import CardImage from "../CardImage";
import CardLink from "../CardLink";
import { RenderIfTrue } from "../../utils";

const MainCard = ({ image, title, path, px, py, fontsize, centerText }) => (
  <Card bgimage={image} path={path}>
    <CardImage src={image} alt={title ? title : "Gambar"} className="rounded" />
    <RenderIfTrue isTrue={title}>
      <CardLink py={py} px={px} fontsize={fontsize} centerText={centerText}>
        {title}
      </CardLink>
    </RenderIfTrue>
  </Card>
);

MainCard.propTypes = {
  image: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string,
  px: PropTypes.string,
  py: PropTypes.string,
  fontsize: PropTypes.string,
  centerText: PropTypes.bool,
};

export default memo(MainCard);

import PropTypes from "prop-types";
import Card from "../Card";
import CardImage from "../CardImage";
import CardLink from "../CardLink";
import FloatingRating from "../FloatingRating";

const MainCard = ({
  image,
  title,
  score,
  path,
  children,
  px,
  py,
  fontsize,
  centerText,
}) => (
  <Card bgimage={image} path={path}>
    <CardImage src={image} alt={title ? title : "Gambar"} className="rounded" />
    {score && <FloatingRating rating={score} />}
    {title ? (
      <CardLink py={py} px={px} fontsize={fontsize} centerText={centerText}>
        {title}
      </CardLink>
    ) : (
      <>{children}</>
    )}
  </Card>
);

MainCard.propTypes = {
  image: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string,
  px: PropTypes.string,
  py: PropTypes.string,
  fontsize: PropTypes.string,
  score: PropTypes.number,
  children: PropTypes.node,
  centerText: PropTypes.bool,
};

export default MainCard;

import PropTypes from "prop-types";

const FloatingRating = ({ rating }) => (
  <div className="absolute -top-0 -left-0 text-slate-800 border-r border-b overflow-hidden border-pink-500 z-50 rounded-br md:rounded-tl text-base">
    <div className="min-w-full min-h-full bg-slate-200 backdrop-blur-lg px-2 py-1 bg-opacity-60">
      <span>
        {rating}&nbsp;
        <span className="text-yellow-600">⭐</span>
      </span>
    </div>
  </div>
);

FloatingRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default FloatingRating;

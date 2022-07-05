import PropTypes from "prop-types";

const AlertPrimary = ({ message }) => (
  <div className="container my-4">
    <div className="bg-primary p-4 rounded">
      <p className="text-lg md:text-xl selection:bg-violet-800 selection:text-violet-300">
        {message}
      </p>
    </div>
  </div>
);

AlertPrimary.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AlertPrimary;

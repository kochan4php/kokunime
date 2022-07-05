import PropTypes from "prop-types";

const AlertWarning = ({ message }) => (
  <div className="container my-4">
    <div className="bg-warning text-dark p-4 rounded">
      <p className="text-lg md:text-xl selection:bg-violet-800 selection:text-violet-300">
        {message}
      </p>
    </div>
  </div>
);

AlertWarning.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AlertWarning;

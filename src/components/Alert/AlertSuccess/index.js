import PropTypes from "prop-types";

const AlertSuccess = ({ message }) => (
  <div className="container my-4">
    <div className="bg-success p-4 rounded">
      <p className="text-lg md:text-xl selection:bg-violet-800 selection:text-violet-300">
        {message}
      </p>
    </div>
  </div>
);

AlertSuccess.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AlertSuccess;

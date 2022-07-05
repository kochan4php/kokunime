import PropTypes from "prop-types";

const AlertDanger = ({ message }) => (
  <div className="container my-4">
    <div className="bg-danger p-4 rounded">
      <p className="text-lg md:text-xl selection:bg-violet-800 selection:text-violet-300">
        {message}
      </p>
    </div>
  </div>
);

AlertDanger.propTypes = {
  message: PropTypes.string.isRequired,
};

export default AlertDanger;

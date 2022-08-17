import PropTypes from "prop-types";
import { memo } from "react";

const Alert = ({ message, bgcolor, textColor }) => (
  <div className="container my-4">
    <div
      className={`${bgcolor ?? "bg-success"} ${
        textColor ?? "text-light"
      } p-4 rounded`}
    >
      <p className="text-lg md:text-xl selection:bg-violet-800 selection:text-violet-300 font-semibold">
        {message ?? "Ini Pesan"}
      </p>
    </div>
  </div>
);

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  bgcolor: PropTypes.string,
  textColor: PropTypes.string,
};

export default memo(Alert);

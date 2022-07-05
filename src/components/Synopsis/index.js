import PropTypes from "prop-types";

const Synopsis = ({ children }) => (
  <div className="mt-10 lg:mt-0 md:pt-10 lg:pt-16">
    <h1 className="text-3xl md:text-4xl mb-7 selection:bg-emerald-500 selection:text-emerald-900">
      Synopsis
    </h1>
    <div className="text-md md:text-lg text-justify md:text-left selection:bg-green-500 selection:text-green-900">
      <p
        className="leading-loose"
        dangerouslySetInnerHTML={{
          __html: children?.replace(/(?:\r\n|\r|\n)/g, "<br />"),
        }}
      />
    </div>
  </div>
);

Synopsis.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Synopsis;

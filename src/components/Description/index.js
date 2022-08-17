import PropTypes from "prop-types";
import { memo } from "react";
import { RenderIfTrue } from "../../utils";

const Description = ({ children, hasTitle, title }) => (
  <div className="mt-10 lg:mt-0 md:pt-10 lg:pt-16">
    <RenderIfTrue isTrue={hasTitle}>
      <h1 className="text-3xl md:text-4xl 2xl:text-5xl mb-7 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
        {title}
      </h1>
    </RenderIfTrue>
    <div className="text-lg lg:text-xl 2xl:text-2xl text-justify md:text-left selection:bg-green-500 selection:text-green-900 font-semibold">
      <p
        className="leading-loose"
        dangerouslySetInnerHTML={{
          __html: children?.replace(/(?:\r\n|\r|\n)/g, "<br />"),
        }}
      />
    </div>
  </div>
);

Description.defaultProps = {
  title: "Ini Judul",
};

Description.propTypes = {
  children: PropTypes.node,
  hasTitle: PropTypes.bool,
  title: PropTypes.string,
};

export default memo(Description);

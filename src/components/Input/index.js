import { memo } from "react";

const Input = ({ width, ...props }) => (
  <input
    className={`search-input truncate outline-none px-5 py-1.5 rounded-sm bg-slate-800 text-base ring-2 focus:ring-4 focus:ring-sky-500 transition-all selection:bg-rose-700 selection:text-rose-300 ${width}`}
    {...props}
  />
);

export default memo(Input);

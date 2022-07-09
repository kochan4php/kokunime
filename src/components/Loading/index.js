import { memo } from "react";

const Loading = () => (
  <div className="container flex justify-center items-start">
    <div className="lds-spinner my-20">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default memo(Loading);

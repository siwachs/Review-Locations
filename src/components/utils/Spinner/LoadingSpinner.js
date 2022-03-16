import React from "react";

import "./loadingSpinner.scss";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds_dual_ring"></div>
    </div>
  );
};

export default LoadingSpinner;

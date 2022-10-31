import React from "react";

import "./GlassContainer.scss";

interface IGlassContainerProps {
  children: JSX.Element | JSX.Element[];
  grain?: boolean;
  triangle?: boolean;
}

const GlassContainer: React.FC<IGlassContainerProps> = ({
  children, triangle = true, grain = true
}): JSX.Element => {
  return (
    <div className="glassContainer">
      <div className="content">{children}</div>
      {grain && <div className="grain" />}
      {triangle && <div className="triangle" />}
    </div>
  );
};

export default GlassContainer;

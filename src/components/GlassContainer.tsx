import React from "react";

import "./GlassContainer.scss";

interface IGlassContainerProps {
  children: JSX.Element | JSX.Element[];
}

const GlassContainer: React.FC<IGlassContainerProps> = ({
  children,
}): JSX.Element => {
  return (
    <div className="glassContainer">
      <div className="content">{children}</div>
      <div className="grain" />
      <div className="triangle" />
    </div>
  );
};

export default GlassContainer;

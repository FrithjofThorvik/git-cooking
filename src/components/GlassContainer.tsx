import React from "react";

import "./GlassContainer.scss";

interface IGlassContainerProps {
  border?: boolean;
  shadow?: boolean;
  children: JSX.Element | JSX.Element[];
  grain?: boolean;
  triangle?: boolean;
}

const GlassContainer: React.FC<IGlassContainerProps> = ({
  children,
  border = false,
  shadow = false,
  triangle = true,
  grain = true,
}): JSX.Element => {
  const style = {
    border: `${border ? "3px solid #94a3b8" : "none"}`,
    borderRadius: `${border ? "15px" : "0px"}`,
    boxShadow: `${shadow ? "0 5px 10px 1px #000000a0" : "none"}`,
  };

  return (
    <div className="glass-container" style={style}>
      <div className="glass-container-content">{children}</div>
      <div className="glass-container-layers">
        {grain && <div className="glass-container-layers-grain" />}
        {triangle && <div className="glass-container-layers-triangle" />}
      </div>
    </div>
  );
};

export default GlassContainer;

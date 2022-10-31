import React from "react";
import GlassContainer from "../GlassContainer";
import image from "../../assets/logo.png";

import "./StartSidebar.scss";

const StartSidebar: React.FC = (): JSX.Element => {
  return (
    <div className="start-sidebar">
      <GlassContainer>
        <img src={image} className="start-sidebar-logo" />
      </GlassContainer>
    </div>
  );
};

export default StartSidebar;

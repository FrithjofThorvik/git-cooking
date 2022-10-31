import React from "react";

import image from "assets/logo.png";
import GlassContainer from "components/GlassContainer";

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

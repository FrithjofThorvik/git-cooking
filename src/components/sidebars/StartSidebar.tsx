import React from "react";

import { imgLogo } from "assets";
import GlassContainer from "components/GlassContainer";

import "./StartSidebar.scss";

const StartSidebar: React.FC = (): JSX.Element => {
  return (
    <div className="start-sidebar">
      <GlassContainer>
        <img src={imgLogo} className="start-sidebar-logo" />
      </GlassContainer>
    </div>
  );
};

export default StartSidebar;

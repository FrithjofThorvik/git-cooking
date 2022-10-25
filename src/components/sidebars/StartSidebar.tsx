import React from "react";
import GlassContainer from "../GlassContainer";
import image from "../../assets/logo.png";

import "./StartSidebar.scss";

const Sidebar: React.FC = (): JSX.Element => {
  return (
    <div className="sidebar">
      <GlassContainer>
        <img src={image} className="logo" />
      </GlassContainer>
    </div>
  );
};

export default Sidebar;

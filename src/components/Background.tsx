import React from "react";
import { imgRestaurant } from "assets";

import "./Background.scss";

interface IBackgroundProps {
  img?: string;
  blur?: number;
  opacity?: number;
  children: JSX.Element | JSX.Element[];
}

const Background: React.FC<IBackgroundProps> = ({
  img = imgRestaurant,
  blur = 0,
  opacity = 0.75,
  children,
}): JSX.Element => {
  return (
    <div className="background">
      <div className="background-content">{children}</div>
      <img
        src={img}
        alt="background"
        className="background-image"
        style={{ filter: `blur(${blur}px)` }}
      />
      <div
        className="background-layer"
        style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      />
    </div>
  );
};

export default Background;

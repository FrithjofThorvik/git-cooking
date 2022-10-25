import React from "react";

import "./InfoBox.scss";

interface IInfoBoxProps {
  infoText: string;
  clock: {
    currentTime: number;
    day: number;
    startTime: number;
    endTime: number;
  };
}

const InfoBox: React.FC<IInfoBoxProps> = ({ infoText, clock }): JSX.Element => {
  return (
    <div className="infoContainer">
      <div className="content">
        <div className="clockArea">
          <div className="clockText">{`Day ${clock.day}`}</div>
          <div className="clock">
            <div className="circleBorder">
              <div className="circle" />
            </div>
          </div>
        </div>
        <div className="infoText">{infoText}</div>
      </div>
    </div>
  );
};

export default InfoBox;

import React from "react";
import ArcProgress from "react-arc-progress";

import "./InfoBox.scss";

// Takes time on format 1259 (12:59) and calculates angle on circle (with angle 0 at 03:00)
const clockToAngle = (time: number) => {
  const anglePerMinute = 360 / 1200;
  const relativeTime = time % 1200;
  let angle = (relativeTime + 1200 - 300) * anglePerMinute;
  return angle;
};

// Formats from number 1259 to string 12:59
const formatTime = (time: number) =>
  time.toString().slice(0, 2) + ":" + time.toString().slice(2);

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
      <div className="clockArea">
        <div className="clockText">{`Day ${clock.day}`}</div>
        <ArcProgress
          progress={
            (clock.currentTime - clock.startTime) /
            (clock.endTime - clock.startTime)
          }
          text={formatTime(clock.currentTime)}
          observer={(current) => {
            const { percentage, currentText } = current;
            //console.log("observer:", percentage, currentText);
          }}
          animationEnd={({ progress, text }) => {
            //console.log("animationEnd", progress, text);
          }}
          arcStart={clockToAngle(clock.startTime)}
          arcEnd={clockToAngle(clock.endTime)}
          size={100}
          fillColor={"#14c299"}
          textStyle={{ color: "#e2e8f0", font: "Nunito Sans" }}
          thickness={6}
        />
      </div>
      <div className="infoArea">
        <p>{infoText}</p>
      </div>
    </div>
  );
};

export default InfoBox;

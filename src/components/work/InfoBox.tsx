import React, { useEffect, useState } from "react";
import ArcProgress from "react-arc-progress";

import { formatClock } from "services/helpers";
import { IArcProgressClock } from "types/interfaces";

import "./InfoBox.scss";

interface IInfoBoxProps {
  day: number;
  infoText: string;
  timeLapsed: number;
  baseDayLength: number;
  dayIsCompleted: boolean;
  dayLengthModifier: number;
}

const InfoBox: React.FC<IInfoBoxProps> = ({
  infoText,
  day,
  timeLapsed,
  baseDayLength,
  dayIsCompleted,
  dayLengthModifier,
}): JSX.Element => {
  const [formattedClock, setFormattedClock] = useState<IArcProgressClock>(
    formatClock(timeLapsed, baseDayLength, dayLengthModifier)
  );

  useEffect(() => {
    setFormattedClock(
      formatClock(timeLapsed, baseDayLength, dayLengthModifier)
    );
  }, [timeLapsed]);

  return (
    <div className="info-box">
      <div className="info-box-clock">
        <div className="info-box-clock-text">{`Day ${day}`}</div>
        {!dayIsCompleted ? (
          <ArcProgress
            progress={formattedClock.progress}
            text={formattedClock.time}
            arcStart={formattedClock.startAngle}
            arcEnd={formattedClock.endAngle}
            size={100}
            animation={false}
            fillColor={formattedClock.color}
            textStyle={{ color: "#e2e8f0", font: "Nunito Sans" }}
            thickness={6}
          />
        ) : (
          <div>Complete</div>
        )}
      </div>
      <div className="info-box-text">
        <p>{infoText}</p>
      </div>
    </div>
  );
};

export default InfoBox;

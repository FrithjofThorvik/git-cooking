import React, { useEffect, useState } from "react";
import ArcProgress from "react-arc-progress";
import HighlightText from "components/HighlightText";

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
  itemsHaveBeenPushed: boolean;
  endDay: () => void;
}

const InfoBox: React.FC<IInfoBoxProps> = ({
  day,
  infoText,
  timeLapsed,
  baseDayLength,
  dayIsCompleted,
  dayLengthModifier,
  itemsHaveBeenPushed,
  endDay,
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
            size={60}
            animation={false}
            fillColor={formattedClock.color}
            textStyle={{ color: "#e2e8f0", font: "Nunito Sans", size: "12px" }}
            thickness={5}
          />
        ) : (
          <div className="info-box-clock-text completed">Completed</div>
        )}
      </div>
      <div className="info-box-text">
        <HighlightText text={infoText} />
      </div>
      {(itemsHaveBeenPushed || dayIsCompleted) && (
        <div className="info-box-end" onClick={() => endDay()}>
          End Day
        </div>
      )}
    </div>
  );
};

export default InfoBox;

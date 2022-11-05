import React from "react";
import ArcProgress from "react-arc-progress";

import "./InfoBox.scss";

interface IArcProgressClock {
  progress: number;
  time: string;
  startAngle: number;
  endAngle: number;
  color: string;
}

const formatClock = (
  timeLapsed: number,
  baseDayLength: number,
  dayLengthModifier: number
): IArcProgressClock => {
  const toMinutesFromHoursAndMinutes = (hours: number, minutes: number) =>
    hours * 60 + minutes;

  const minutesToAngle = (minutes: number) => {
    const clock_12 = toMinutesFromHoursAndMinutes(12, 0); // full turn
    const clock_03 = toMinutesFromHoursAndMinutes(3, 0); // angle 0 on clock is 03:00
    const anglePerMinute = 360 / clock_12;
    const relativeTime = minutes % clock_12; // to avoid more than full turn on clock

    const angleDiff = clock_12 - clock_03;

    // Calculate angle for time after 12:00, with offset since angle 0 at 03:00
    const angle = (relativeTime + angleDiff) * anglePerMinute;
    return angle;
  };

  const toFormattedHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimeInMinutes = toMinutesFromHoursAndMinutes(13, 0);
  let endTimeInMinutes =
    toMinutesFromHoursAndMinutes(21, 0) + 60 * (dayLengthModifier - 1);

  // Converts from timelapsed in ms to minutes on the clock
  const relativeMinutes =
    (timeLapsed * (endTimeInMinutes - startTimeInMinutes)) /
      (baseDayLength * dayLengthModifier) +
    startTimeInMinutes;

  const progress = timeLapsed / (baseDayLength * dayLengthModifier);

  return {
    progress: progress,
    time: progress === 1 ? "DONE" : toFormattedHoursAndMinutes(relativeMinutes),
    startAngle: minutesToAngle(startTimeInMinutes),
    endAngle: minutesToAngle(endTimeInMinutes),
    color: progress === 1 ? "#dc3c76" : "#14c299",
  };
};

interface IInfoBoxProps {
  infoText: string;
  day: number;
  timeLapsed: number;
  baseDayLength: number;
  dayLengthModifier: number;
}

const InfoBox: React.FC<IInfoBoxProps> = ({
  infoText,
  day,
  timeLapsed,
  baseDayLength,
  dayLengthModifier,
}): JSX.Element => {
  const formattedClock = formatClock(
    timeLapsed,
    baseDayLength,
    dayLengthModifier
  );

  return (
    <div className="info-box">
      <div className="info-box-clock">
        <div className="info-box-clock-text">{`Day ${day}`}</div>
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
      </div>
      <div className="info-box-text">
        <p>{infoText}</p>
      </div>
    </div>
  );
};

export default InfoBox;

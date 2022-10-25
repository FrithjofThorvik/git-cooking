import React from "react";

import InfoBox from "../../components/InfoBox";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const clock = {
    startTime: 1130,
    endTime: 2100,
    currentTime: 1700,
    day: 3,
  };
  return <InfoBox infoText="Waiting for coworker..." clock={clock} />;
};

export default InfoBoxController;

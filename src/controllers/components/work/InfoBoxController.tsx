import React from "react";

import InfoBox from "../../../components/work/InfoBox";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  return (
    <InfoBox
      infoText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo"
      clock={{
        startTime: 1300,
        endTime: 2100,
        currentTime: 1930,
        day: 3,
      }}
    />
  );
};

export default InfoBoxController;

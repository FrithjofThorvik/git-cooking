import React from "react";

import { useGameData } from "hooks/useGameData";
import InfoBox from "components/work/InfoBox";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const { gameData, setGameData } = useGameData();

  return (
    <InfoBox
      infoText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo"
      clock={{
        startTime: 1300,
        endTime: 2100,
        currentTime: 1930,
        day: gameData.day,
      }}
    />
  );
};

export default InfoBoxController;

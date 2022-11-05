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
      timeLapsed={gameData.timeLapsed}
      baseDayLength={gameData.baseDayLength}
      dayLengthModifier={1}
      day={gameData.day}
    />
  );
};

export default InfoBoxController;

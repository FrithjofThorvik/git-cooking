import React from "react";

import { useGameData } from "hooks/useGameData";
import { useGameTime } from "hooks/useGameTime";
import InfoBox from "components/work/InfoBox";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  return (
    <InfoBox
      infoText="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo"
      timeLapsed={timeLapsed}
      baseDayLength={gameData.stats.dayLength.base}
      dayLengthModifier={
        gameData.stats.dayLength.get(gameData.store.upgrades) /
        gameData.stats.dayLength.base
      }
      day={gameData.day}
    />
  );
};

export default InfoBoxController;

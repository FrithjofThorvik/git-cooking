import React from "react";

import { useGameData } from "hooks/useGameData";
import { useGameTime } from "hooks/useGameTime";
import InfoBox from "components/work/InfoBox";
import { useInfoBoxText } from "hooks/useInfoBoxText";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const infoText = useInfoBoxText(gameData);

  return (
    <InfoBox
      infoText={infoText}
      timeLapsed={timeLapsed}
      baseDayLength={gameData.stats.dayLength.base}
      dayLengthModifier={
        gameData.stats.dayLength.value / gameData.stats.dayLength.base
      }
      day={gameData.states.day}
      dayIsCompleted={gameData.states.isDayComplete}
    />
  );
};

export default InfoBoxController;

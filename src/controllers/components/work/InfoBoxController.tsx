import React, { useEffect, useState } from "react";

import { setGameData, useGameData } from "hooks/useGameData";
import { useGameTime } from "hooks/useGameTime";
import { useInfoBoxText } from "hooks/useInfoBoxText";
import InfoBox from "components/work/InfoBox";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const [isPushed, setIsPushed] = useState<boolean>(false);
  const infoText = useInfoBoxText(gameData, isPushed);

  const endDay = () => {
    let updatedGameData = gameData.endDay(timeLapsed);
    setGameData({ ...updatedGameData });
  };

  useEffect(() => {
    if (!isPushed) {
      gameData.git.getActiveProject()?.remote.branches.forEach((b) => {
        const pushedItems = gameData.git
          .getActiveProject()
          ?.remote.getPushedItems(b.name);
        if (pushedItems && pushedItems.length > 0) setIsPushed(true);
      });
    }
  }, [gameData.git.getActiveProject()?.remote.branches]);

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
      itemsHaveBeenPushed={isPushed}
      endDay={endDay}
    />
  );
};

export default InfoBoxController;

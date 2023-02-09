import React, { useEffect, useState } from "react";

import { setGameData, useGameData } from "hooks/useGameData";
import { useGameTime } from "hooks/useGameTime";
import { useInfoBoxText } from "hooks/useInfoBoxText";
import InfoBox from "components/work/InfoBox";
import { objectsEqual } from "services/helpers";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const [isPushed, setIsPushed] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const infoText = useInfoBoxText(gameData, isPushed);

  const checkForUnsyncedChanges = (): boolean => {
    const activeBranch = gameData.git.getActiveBranch();
    if (!activeBranch) return false;

    const pushedItems = gameData.git
      .getActiveProject()
      ?.remote.getPushedItems(activeBranch.name);
    const createdItems = gameData.git.getCommitFromId(
      activeBranch.targetCommitId
    )?.directory.createdItems;
    if (!(createdItems && activeBranch.remoteTrackingBranch && pushedItems))
      return false;
    return !objectsEqual(pushedItems, createdItems);
  };

  const endDay = (confirm?: boolean, decline?: boolean) => {
    const hasUnsyncedChanges = checkForUnsyncedChanges();

    if (hasUnsyncedChanges) {
      setShowWarning(!decline);
    }
    if (!hasUnsyncedChanges || confirm) {
      let updatedGameData = gameData.endDay(timeLapsed);
      setGameData({ ...updatedGameData });
    }
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
      showWarning={showWarning}
      endDay={endDay}
    />
  );
};

export default InfoBoxController;

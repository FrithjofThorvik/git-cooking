import React, { useEffect, useState } from "react";

import { setGameData, useGameData } from "hooks/useGameData";
import { useGameTime } from "hooks/useGameTime";
import { useInfoBoxText } from "hooks/useInfoBoxText";
import InfoBox from "components/work/InfoBox";
import { objectsEqual } from "services/helpers";
import { ICommit } from "types/gitInterfaces";
import ExtraInfo from "components/work/ExtraInfo";

interface IInfoBoxControllerProps {}

const InfoBoxController: React.FC<
  IInfoBoxControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const [isPushed, setIsPushed] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [unsyncedBranches, setUnsyncedBranches] = useState<string[]>([]);
  const [unsyncedActiveBranch, setUnsyncedActiveBranch] =
    useState<boolean>(false);
  const [declinedEndDay, setDeclinedEndDay] = useState<boolean>(false);
  const infoText = useInfoBoxText(gameData, isPushed, declinedEndDay);

  const [commitHistory, setCommitHistory] = useState<ICommit[]>([]);

  useEffect(() => {
    setCommitHistory(gameData.git.getCommitHistory());
  }, [gameData.git.commits]);

  const getBranchSyncStatus = () => {
    return gameData.git.branches.map((b) => {
      let unsynced = false;
      const pushedItems = gameData.git
        .getActiveProject()
        ?.remote.getPushedItems(b.name);
      const createdItems = gameData.git.getCommitFromId(b.targetCommitId)
        ?.directory.createdItems;
      if (createdItems && b.remoteTrackingBranch && pushedItems)
        unsynced = !objectsEqual(pushedItems, createdItems);
      return { name: b.name, isUnsynced: unsynced };
    });
  };

  const endDay = (confirm?: boolean, decline?: boolean) => {
    const branchSyncStatus = getBranchSyncStatus();
    const hasUnsyncedChanges = branchSyncStatus.some((b) => b.isUnsynced);

    if (hasUnsyncedChanges) {
      setShowWarning(!decline);
      setUnsyncedBranches(
        branchSyncStatus.filter((b) => b.isUnsynced).map((b) => b.name)
      );
      decline !== undefined && setDeclinedEndDay(decline);
    }
    if (!hasUnsyncedChanges || confirm) {
      setDeclinedEndDay(false);
      setShowWarning(false);
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

  useEffect(() => {
    const activeBranch = gameData.git.getActiveBranch();
    const branchSyncStatus = getBranchSyncStatus();
    setUnsyncedBranches(
      branchSyncStatus.filter((b) => b.isUnsynced).map((b) => b.name)
    );
    setUnsyncedActiveBranch(
      branchSyncStatus.some(
        (b) => b.isUnsynced && b.name === activeBranch?.name
      )
    );
  }, [gameData.git.getActiveBranch(), gameData.git.commits]);

  return (
    <>
      <ExtraInfo
        commits={commitHistory}
        unSynced={unsyncedActiveBranch}
        branch={gameData.git.getActiveBranch()}
      />
      <InfoBox
        infoText={infoText}
        timeLapsed={timeLapsed}
        baseDayLength={gameData.stats.dayLength.base}
        dayLengthModifier={
          gameData.stats.dayLength.value / gameData.stats.dayLength.base
        }
        unsyncedBranches={unsyncedBranches}
        day={gameData.states.day}
        dayIsCompleted={gameData.states.isDayComplete}
        itemsHaveBeenPushed={isPushed}
        showWarning={showWarning}
        endDay={endDay}
      />
    </>
  );
};

export default InfoBoxController;

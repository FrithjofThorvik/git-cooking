import React, { useEffect } from "react";

import { setGameData, useGameData } from "hooks/useGameData";
import { TutorialType } from "types/enums";
import FetchScreen from "components/screens/FetchScreen";
import TerminalController from "controllers/components/work/TerminalController";
import { copyObjectWithoutRef } from "services/helpers";
import { IGitCooking } from "types/gameDataInterfaces";

interface IFetchScreenControllerProps {
  setActiveTutorialTypes: (tutorials: TutorialType[]) => void;
  goBack: () => void;
}

const FetchScreenController: React.FC<IFetchScreenControllerProps> = ({
  setActiveTutorialTypes,
  goBack,
}): JSX.Element => {
  const gameData = useGameData();

  useEffect(() => {
    setActiveTutorialTypes([TutorialType.FETCH_INTRO]);
    if (gameData.git.remote.branches.some((b) => b.isFetched)) {
      setActiveTutorialTypes([TutorialType.FETCH_CONTENT]);
    }
  }, [gameData.git.remote.branches]);

  // Starts day when a remote branch has been checkout out
  useEffect(() => {
    let updatedGameData: IGitCooking = copyObjectWithoutRef(gameData);
    if (
      !updatedGameData.git.branches.some(
        (b) =>
          b.remoteTrackingBranch &&
          updatedGameData.git.remote.getRemoteBranch(b.remoteTrackingBranch)
      )
    )
      return;
    updatedGameData = updatedGameData.startDay();
    setGameData({ ...updatedGameData });
  }, [gameData.git.branches]);

  return (
    <FetchScreen
      remote={gameData.git.remote}
      terminalController={<TerminalController />}
      isFirstDay={gameData.states.day === 0}
      goBack={goBack}
    />
  );
};

export default FetchScreenController;

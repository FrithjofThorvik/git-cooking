import React, { useEffect } from "react";

import { useGameData } from "hooks/useGameData";
import { TutorialType } from "types/enums";
import FetchScreen from "components/screens/FetchScreen";
import TerminalController from "controllers/components/work/TerminalController";

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

  return (
    <FetchScreen
      remote={gameData.git.remote}
      terminalController={<TerminalController />}
      isFirstDay={gameData.states.day === 1}
      goBack={goBack}
    />
  );
};

export default FetchScreenController;

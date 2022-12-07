import React from "react";

import { useGameData } from "hooks/useGameData";
import PullScreen from "components/screens/PullScreen";
import TerminalController from "controllers/components/work/TerminalController";

interface IPullScreenControllerProps {}

const PullScreenController: React.FC<
  IPullScreenControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  return (
    <PullScreen
      remote={gameData.git.remote}
      terminalController={<TerminalController />}
    />
  );
};

export default PullScreenController;

import React from "react";

import { useGameData } from "hooks/useGameData";
import FetchScreen from "components/screens/FetchScreen";
import TerminalController from "controllers/components/work/TerminalController";

interface IFetchScreenControllerProps {}

const FetchScreenController: React.FC<
  IFetchScreenControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  return (
    <FetchScreen
      remote={gameData.git.remote}
      terminalController={<TerminalController />}
    />
  );
};

export default FetchScreenController;

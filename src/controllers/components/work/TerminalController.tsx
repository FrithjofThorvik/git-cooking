import React from "react";

import { git } from "services/git";
import { IGitResponse } from "types/interfaces";
import { IGitCooking } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Terminal from "components/work/Terminal";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const parseCommand = (
    gameData: IGitCooking,
    command: string
  ): IGitResponse => {
    return git.exec(gameData, setGameData, command);
  };

  return <Terminal parseCommand={parseCommand} gameData={gameData} />;
};

export default TerminalController;

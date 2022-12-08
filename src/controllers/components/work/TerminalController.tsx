import React from "react";

import { git } from "services/git";
import { IGitResponse } from "types/interfaces";
import { IGitCooking } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Terminal from "components/work/Terminal";
import { copyObjectWithoutRef } from "services/helpers";
import { useGameTime } from "hooks/useGameTime";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();

  const parseCommand = (
    gameData: IGitCooking,
    command: string
  ): IGitResponse => {
    const newGameData = updateCommandHistory(
      copyObjectWithoutRef(gameData),
      command
    );

    return git.exec(newGameData, setGameData, command, timeLapsed);
  };

  const updateCommandHistory = (
    newGameData: IGitCooking,
    newCommand: string
  ) => {
    const newHistory = [
      newCommand,
      ...newGameData.commandHistory.filter((prev) => prev !== newCommand),
    ];
    newGameData.commandHistory = newHistory;
    return newGameData;
  };

  return <Terminal parseCommand={parseCommand} gameData={gameData} />;
};

export default TerminalController;

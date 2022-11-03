import React from "react";

import { useGameData } from "hooks/useGameData";
import Terminal from "components/work/Terminal";
import { GameState } from "types/enums";

interface ITerminalControllerProps { }

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const { gameData, setGameData } = useGameData();

  const parseGitCommand = (args: string[]) => {
    // Secret command
    if (
      process.env.REACT_APP_SECRET_GIT_COMMAND &&
      args[0] == process.env.REACT_APP_SECRET_GIT_COMMAND
    ) {
      setGameData({ ...gameData, gameState: GameState.SUMMARY });
    }
  };

  // return command if valid and a status message if needed
  const parseCommand = (command: string): [string, string] => {
    const args = command.split(" ");

    if (args[0] === "git") parseGitCommand(args.slice(1));

    return [command, command];
  };

  return (
    <Terminal
      parseCommand={parseCommand}
    />
  );
};

export default TerminalController;

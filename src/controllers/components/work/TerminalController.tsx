import React, { useState } from "react";

import { useGameData } from "hooks/useGameData";
import Terminal from "components/work/Terminal";
import { GameState } from "types/enums";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
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

  const parseCommand = (command: string) => {
    const args = command.split(" ");

    if (args[0] === "git") parseGitCommand(args.slice(1));

    // for now just display the command in history
    setHistory((prevState) => [...prevState, command]);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      parseCommand(value);
      setValue("");
    }
  };

  return (
    <Terminal
      handleChange={onChange}
      handleKeyDown={onKeyDown}
      value={value}
      history={history}
    />
  );
};

export default TerminalController;

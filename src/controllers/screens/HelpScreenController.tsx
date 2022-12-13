import React, { useEffect } from "react";

import { GameState } from "types/enums";
import { setGameData, useGameData } from "hooks/useGameData";
import { setGameTime, useGameTime } from "hooks/useGameTime";
import HelpScreen from "components/screens/HelpScreen";

interface IHelpScreenControllerProps {}

const HelpScreenController: React.FC<
  IHelpScreenControllerProps
> = ({}): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed, isPaused } = useGameTime();

  const closeHelpScreen = () => {
    const updatedHelp = gameData.help.setIsHelpScreenOpen(false);
    setGameData({ ...gameData, help: updatedHelp });
  };

  useEffect(() => {
    if (gameData.states.gameState === GameState.WORKING && !isPaused)
      setGameTime(timeLapsed, true);

    return () => {
      if (gameData.states.gameState === GameState.WORKING && isPaused)
        setGameTime(timeLapsed, false);
    };
  }, [isPaused]);

  return <HelpScreen help={gameData.help} closeHelpScreen={closeHelpScreen} />;
};

export default HelpScreenController;

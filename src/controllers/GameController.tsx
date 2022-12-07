import React, { useEffect } from "react";

import { GameState } from "types/enums";
import { ITutorial } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import PullScreenController from "./screens/PullScreenController";
import HelpScreenController from "./screens/HelpScreenController";
import WorkScreenController from "controllers/screens/WorkScreenController";
import StoreScreenController from "controllers/screens/StoreScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";
import MergeScreenController from "./screens/MergeScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();

  useEffect(() => {}, []);

  const startPull = () => {
    let updatedGameData = gameData.startPull();
    setGameData({ ...updatedGameData });
  };

  const endDay = () => {
    let updatedGameData = gameData.endDay();
    setGameData({ ...updatedGameData });
  };

  const completeTutorial = (tutorial: ITutorial) => {
    const updatedHelp = gameData.help.completeTutorial(tutorial);
    setGameData({ ...gameData, help: updatedHelp });
  };

  const openHelpScreen = () => {
    const updatedHelp = gameData.help.setIsHelpScreenOpen(true);
    setGameData({ ...gameData, help: updatedHelp });
  };

  const gameStateMachine = () => {
    switch (gameData.gameState) {
      case GameState.WORKING:
        return (
          <WorkScreenController
            endDay={endDay}
            openHelpScreen={openHelpScreen}
            completeTutorial={completeTutorial}
          />
        );
      case GameState.PULL:
        return <PullScreenController />;
      case GameState.MERGE:
        return (
          <MergeScreenController
            goNext={() =>
              setGameData({ ...gameData, gameState: GameState.SUMMARY })
            }
          />
        );
      case GameState.SUMMARY:
        return (
          <SummaryScreenController
            openHelpScreen={openHelpScreen}
            goNext={() =>
              setGameData({ ...gameData, gameState: GameState.UPGRADE })
            }
            goBack={() =>
              setGameData({ ...gameData, gameState: GameState.MERGE })
            }
          />
        );
      case GameState.UPGRADE:
        return (
          <StoreScreenController
            openHelpScreen={openHelpScreen}
            completeTutorial={completeTutorial}
            goNext={() => startPull()}
            goBack={() =>
              setGameData({ ...gameData, gameState: GameState.SUMMARY })
            }
          />
        );
      case GameState.LOADING:
        return (
          <div>
            <p>Loading...</p>
            <button
              onClick={() => {
                localStorage.removeItem("git-cooking");
                localStorage.removeItem("git-cooking-time");
                location.reload();
              }}
            >
              Refresh local storage
            </button>
          </div>
        );
    }
  };

  return (
    <div className="game">
      {gameData && gameData.help.isHelpScreenOpen ? (
        <HelpScreenController completeTutorial={completeTutorial} />
      ) : (
        gameStateMachine()
      )}
    </div>
  );
};

export default GameController;

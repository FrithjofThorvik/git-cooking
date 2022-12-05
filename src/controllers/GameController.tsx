import React from "react";

import { GameState } from "types/enums";
import { ITutorial } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import WorkScreenController from "controllers/screens/WorkScreenController";
import HelpScreenController from "./screens/HelpScreenController";
import StoreScreenController from "controllers/screens/StoreScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();

  const endDay = () => {
    let updatedGameData = gameData.endDay();

    setGameData({
      ...updatedGameData,
    });
  };

  const startDay = () => {
    let updatedGameData = gameData.startDay();

    setGameData({
      ...updatedGameData,
    });
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
      case GameState.MERGE:
        return (
          <button
            onClick={() =>
              setGameData({ ...gameData, gameState: GameState.SUMMARY })
            }
            style={{ width: "250px", height: "50px" }}
          >
            Go to summary
          </button>
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
            goNext={() => startDay()}
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

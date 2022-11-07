import React from "react";

import { GameState } from "types/enums";
import { useGameData, setGameData } from "hooks/useGameData";
import WorkScreenController from "controllers/screens/WorkScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";
import UpgradeScreenController from "controllers/screens/UpgradeScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();

  const gameStateMachine = () => {
    switch (gameData.gameState) {
      case GameState.WORKING:
        return (
          <WorkScreenController
            goToSummary={() =>
              setGameData({ ...gameData, gameState: GameState.SUMMARY })
            }
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
        break;
      case GameState.SUMMARY:
        return (
          <SummaryScreenController
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
          <UpgradeScreenController
            goNext={() =>
              setGameData({ ...gameData, gameState: GameState.WORKING })
            }
            goBack={() =>
              setGameData({ ...gameData, gameState: GameState.SUMMARY })
            }
          />
        );
      case GameState.LOADING:
        return <div>Loading...</div>;
    }
  };

  return <div className="game">{gameData && gameStateMachine()}</div>;
};

export default GameController;

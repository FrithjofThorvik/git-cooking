import React from "react";

import { IGitTree } from "types/gitInterfaces";
import { GameState } from "types/enums";
import { IItemInterface } from "types/gameDataInterfaces";
import { defaultGitTree } from "data/defaultGitTree";
import { defaultItemData } from "data/defaultItemData";
import { copyObjectWithoutRef } from "services/helpers";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { setGameData, useGameData } from "hooks/useGameData";
import WorkScreenController from "controllers/screens/WorkScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";
import UpgradeScreenController from "controllers/screens/StoreScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();

  const endDay = () => {
    const { revenue, cost } = calculateRevenueAndCost(gameData.git);
    setGameData({
      ...gameData,
      gameState: GameState.SUMMARY,
      store: {
        ...gameData.store,
        cash: gameData.store.cash + (revenue - cost),
      },
    });
  };

  const startDay = () => {
    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface = copyObjectWithoutRef(defaultItemData)
    const gitUpdated: IGitTree = {
      ...gitReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    setGameData({
      ...gameData,
      day: gameData.day + 1,
      git: gitUpdated,
      itemInterface: itemInterfaceReset,
      gameState: GameState.WORKING,
    });
  };

  const gameStateMachine = () => {
    switch (gameData.gameState) {
      case GameState.WORKING:
        return <WorkScreenController endDay={endDay} />;
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

  return <div className="game">{gameData && gameStateMachine()}</div>;
};

export default GameController;

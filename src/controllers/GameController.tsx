import React, { useState } from "react";

import { GameState } from "types/enums";
import WorkScreenController from "controllers/screens/WorkScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";
import UpgradeScreenController from "controllers/screens/UpgradeScreenController";

const GameController: React.FC = (): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.SUMMARY);

  const gameStateMachine = () => {
    switch (gameState) {
      case GameState.WORKING:
        return (
          <WorkScreenController
            goToSummary={() => setGameState(GameState.SUMMARY)}
          />
        );
      case GameState.MERGE:
        //todo
        console.log("merge");
        break;
      case GameState.SUMMARY:
        return (
          <SummaryScreenController
            goNext={() => setGameState(GameState.UPGRADE)}
            goBack={() => setGameState(GameState.MERGE)}
          />
        );
      case GameState.UPGRADE:
        return (
          <UpgradeScreenController
            goNext={() => setGameState(GameState.WORKING)}
            goBack={() => setGameState(GameState.SUMMARY)}
          />
        );
    }
  };

  return <div className="game">{gameStateMachine()}</div>;
};

export default GameController;

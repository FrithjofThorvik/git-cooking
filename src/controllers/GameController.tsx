import React, { useState } from "react";

import { GameState } from "../types/enums";
import WorkScreenController from "./screens/WorkScreenController";
import SummaryScreenController from "./screens/SummaryScreenController";

const GameController: React.FC = (): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.SUMMARY);

  return (
    <div className="game">
      {gameState === GameState.WORKING ? (
        <WorkScreenController
          goToSummary={() => setGameState(GameState.SUMMARY)}
        />
      ) : (
        gameState === GameState.SUMMARY && <SummaryScreenController />
      )}
    </div>
  );
};

export default GameController;

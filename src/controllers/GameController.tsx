import React, { useState } from "react";

import { GameState } from "types/enums";
import WorkScreenController from "controllers/screens/WorkScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";

const GameController: React.FC = (): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.WORKING);

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

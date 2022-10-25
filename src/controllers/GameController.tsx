import React, { useState } from "react";

import { GameState } from "../types/enums";
import WorkController from "./pages/WorkController";
import SummaryController from "./pages/SummaryController";

const GameController: React.FC = (): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.WORKING);
  return (
    <div className="game">
      {/* Add routing logic */}
      {gameState === GameState.WORKING ? (
        <WorkController />
      ) : (
        gameState === GameState.SUMMARY && <SummaryController />
      )}
    </div>
  );
};

export default GameController;

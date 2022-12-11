import React from "react";

import { GameState } from "types/enums";
import { ITutorial } from "types/gameDataInterfaces";
import { setGameTime, useGameTime } from "hooks/useGameTime";
import { setGameData, useGameData } from "hooks/useGameData";
import FetchScreenController from "./screens/FetchScreenController";
import HelpScreenController from "./screens/HelpScreenController";
import WorkScreenController from "controllers/screens/WorkScreenController";
import StoreScreenController from "controllers/screens/StoreScreenController";
import MergeScreenController from "./screens/MergeScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();

  const startFetch = () => {
    let updatedGameData = gameData.startFetch();
    if (timeLapsed !== 0) setGameTime(0);
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

  const setGameState = (state: GameState) => {
    const updatedStates = gameData.states.setGameState(state);
    setGameData({ ...gameData, states: updatedStates });
  };

  const gameStateMachine = () => {
    switch (gameData.states.gameState) {
      case GameState.WORKING:
        return (
          <WorkScreenController
            openHelpScreen={openHelpScreen}
            completeTutorial={completeTutorial}
          />
        );
      case GameState.FETCH:
        return <FetchScreenController />;
      case GameState.MERGE:
        return (
          <MergeScreenController
            goNext={() => setGameState(GameState.SUMMARY)}
          />
        );
      case GameState.SUMMARY:
        return (
          <SummaryScreenController
            openHelpScreen={openHelpScreen}
            goNext={() => setGameState(GameState.UPGRADE)}
            goBack={() => setGameState(GameState.MERGE)}
          />
        );
      case GameState.UPGRADE:
        return (
          <StoreScreenController
            openHelpScreen={openHelpScreen}
            completeTutorial={completeTutorial}
            goNext={() => startFetch()}
            goBack={() => setGameState(GameState.SUMMARY)}
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

import React, { useEffect, useState } from "react";

import { ITutorial } from "types/gameDataInterfaces";
import { GameState, TutorialType } from "types/enums";
import { setGameTime, useGameTime } from "hooks/useGameTime";
import { setGameData, useGameData } from "hooks/useGameData";
import Tutorials from "components/Tutorials";
import HelpButton from "components/HelpButton";
import HelpScreenController from "./screens/HelpScreenController";
import WorkScreenController from "controllers/screens/WorkScreenController";
import FetchScreenController from "./screens/FetchScreenController";
import StoreScreenController from "controllers/screens/StoreScreenController";
import SummaryScreenController from "controllers/screens/SummaryScreenController";
import MergeScreenController from "./screens/MergeScreenController";

const GameController: React.FC = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const [activeTutorialTypes, setActiveTutorialTypes] = useState<
    TutorialType[]
  >([]);

  useEffect(() => {
    const terminal = document.getElementById("git-terminal");
    if (!terminal) return;
    if (
      gameData.help
        .getTutorialsByTypes(activeTutorialTypes)
        .every((t) => !t.completed)
    )
      terminal.blur();
  }, [activeTutorialTypes]);

  useEffect(() => {
    const remainingTutorials = gameData.help.tutorials.filter(
      (t) => !t.completed
    );
    if (
      (remainingTutorials.length === 1 &&
        remainingTutorials[0].type === TutorialType.HELP) ||
      (gameData.states.day === 3 &&
        remainingTutorials.some((t) => t.type === TutorialType.HELP))
    )
      unlockTutorialByType([TutorialType.HELP]);
  }, gameData.help.tutorials);

  const startFetch = () => {
    let updatedGameData = gameData.startFetch();
    if (timeLapsed !== 0) setGameTime(0);
    setGameData({ ...updatedGameData });
  };

  const completeTutorials = (tutorials: ITutorial[]) => {
    const updatedHelp = gameData.help.completeTutorials(tutorials);
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

  const returnFromFetch = () => {
    let updatedStates = gameData.states;
    updatedStates.gameState = GameState.UPGRADE;
    setGameData({ ...gameData, states: updatedStates });
  };

  const pauseGameTime = (isPaused: boolean) =>
    setGameTime(timeLapsed, isPaused);

  const completeDay = () => {
    let updatedGameData = gameData.completeDay();
    setGameData({ ...updatedGameData });
  };

  const unlockTutorialByType = (tutorialTypes: TutorialType[]) => {
    const tutorials = gameData.help.getTutorialsByTypes(tutorialTypes);
    const updatedHelp = gameData.help.unlockTutorials(tutorials);
    setGameData({ ...gameData, help: updatedHelp });
  };

  const gameStateMachine = () => {
    switch (gameData.states.gameState) {
      case GameState.WORKING:
        return (
          <WorkScreenController setActiveTutorialTypes={unlockTutorialByType} />
        );
      case GameState.FETCH:
        if (!gameData.states.hasStartedFetch) startFetch();
        return (
          <FetchScreenController
            setActiveTutorialTypes={unlockTutorialByType}
            goBack={() => returnFromFetch()}
          />
        );
      case GameState.MERGE:
        return (
          <MergeScreenController
            goNext={completeDay}
            setActiveTutorialTypes={unlockTutorialByType}
          />
        );
      case GameState.SUMMARY:
        return (
          <SummaryScreenController
            goNext={() => setGameState(GameState.UPGRADE)}
          />
        );
      case GameState.UPGRADE:
        return (
          <StoreScreenController
            setActiveTutorialTypes={unlockTutorialByType}
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
        <HelpScreenController />
      ) : (
        <>
          {gameStateMachine()}
          <Tutorials
            tutorials={gameData.help.getTutorialsByTypes(activeTutorialTypes)}
            unlockedTutorials={gameData.help.unlockedTutorials}
            completeTutorials={completeTutorials}
            setActiveTutorialTypes={setActiveTutorialTypes}
            hideOnCompletion
            stopGameTime
            typewriter
            pauseGameTime={pauseGameTime}
          />
          <HelpButton onClick={openHelpScreen} isOpen={false} />
        </>
      )}
    </div>
  );
};

export default GameController;

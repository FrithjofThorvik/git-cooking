import React from "react";

import { ITutorial } from "types/gameDataInterfaces";
import { useTimeLapsed } from "hooks/useTimeLapsed";
import { setGameData, useGameData } from "hooks/useGameData";
import { setGameTime, useGameTime } from "hooks/useGameTime";
import WorkScreen from "components/screens/WorkScreen";
import FileController from "controllers/components/work/ItemController";
import StageController from "controllers/components/work/StageController";
import OrdersController from "controllers/components/work/OrdersController";
import InfoBoxController from "controllers/components/work/InfoBoxController";
import TerminalController from "controllers/components/work/TerminalController";
import DirectoryController from "controllers/components/work/DirectoryController";
import CommitHistoryController from "controllers/components/work/CommitHistoryController";

interface IWorkScreenControllerProps {
  openHelpScreen: () => void;
  completeTutorial: (tutorial: ITutorial) => void;
}

const WorkScreenController: React.FC<IWorkScreenControllerProps> = ({
  openHelpScreen,
  completeTutorial,
}): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  useTimeLapsed(500, () => {
    setGameData({
      ...gameData,
      states: { ...gameData.states, isDayComplete: true },
    });
  });

  const pauseGameTime = (isPaused: boolean) =>
    setGameTime(timeLapsed, isPaused);

  return (
    <WorkScreen
      help={gameData.help}
      pauseGameTime={pauseGameTime}
      openHelpScreen={openHelpScreen}
      completeTutorial={completeTutorial}
      ordersController={<OrdersController />}
      infoBoxController={<InfoBoxController />}
      terminalController={<TerminalController />}
      fileController={<FileController />}
      stageController={<StageController />}
      directoryController={<DirectoryController />}
      commitHistoryController={<CommitHistoryController />}
    />
  );
};

export default WorkScreenController;

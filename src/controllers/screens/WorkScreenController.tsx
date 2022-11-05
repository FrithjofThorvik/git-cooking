import React, { useState, useEffect } from "react";

import { useGameData } from "hooks/useGameData";
import WorkScreen from "components/screens/WorkScreen";
import FileController from "controllers/components/work/FileController";
import StageController from "controllers/components/work/StageController";
import OrdersController from "controllers/components/work/OrdersController";
import InfoBoxController from "controllers/components/work/InfoBoxController";
import TerminalController from "controllers/components/work/TerminalController";
import DirectoryController from "controllers/components/work/DirectoryController";
import CommitHistoryController from "controllers/components/work/CommitHistoryController";
import { IGitCooking } from "types/interfaces";

interface IWorkScreenControllerProps {
  goToSummary: () => void;
}

const WorkScreenController: React.FC<IWorkScreenControllerProps> = ({
  goToSummary,
}): JSX.Element => {
  const { gameData, setGameData } = useGameData();
  const dayLengthModifier = 1; //TODO: calculate from upgrades
  useTimeLapsed(gameData, setGameData, dayLengthModifier);

  return (
    <WorkScreen
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

const useTimeLapsed = (
  gameData: IGitCooking,
  setGameData: (gameData: IGitCooking) => void,
  dayLengthModifier: number
): void => {
  const [referenceTime, setReferenceTime] = useState(Date.now());

  useEffect(() => {
    const timeId = setTimeout(() => {
      const prevTime = gameData.timeLapsed;

      const now = Date.now();
      const dt = now - referenceTime;
      setReferenceTime(now);

      let newTimeLapsed = prevTime + dt;
      const dayLength = gameData.baseDayLength * dayLengthModifier;
      if (newTimeLapsed > dayLength) newTimeLapsed = dayLength;
      setGameData({
        ...gameData,
        timeLapsed: newTimeLapsed,
      });
    }, 100);

    return () => {
      clearTimeout(timeId);
    };
  }, [gameData.timeLapsed]);
};

export default WorkScreenController;

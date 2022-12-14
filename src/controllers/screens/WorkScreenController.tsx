import React, { useEffect } from "react";

import { useGameTime } from "hooks/useGameTime";
import { TutorialType } from "types/enums";
import { useTimeLapsed } from "hooks/useTimeLapsed";
import { toMilliseconds } from "services/helpers";
import { setGameData, useGameData } from "hooks/useGameData";
import WorkScreen from "components/screens/WorkScreen";
import FileController from "controllers/components/work/ItemController";
import StageController from "controllers/components/work/StageController";
import OrdersController from "controllers/components/work/OrdersController";
import InfoBoxController from "controllers/components/work/InfoBoxController";
import TerminalController from "controllers/components/work/TerminalController";
import DirectoryController from "controllers/components/work/DirectoryController";
import CommitHistoryController from "controllers/components/work/CommitHistoryController";

interface IWorkScreenControllerProps {
  setActiveTutorialTypes: (tutorials: TutorialType[]) => void;
}

const WorkScreenController: React.FC<IWorkScreenControllerProps> = ({
  setActiveTutorialTypes,
}): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  useTimeLapsed(500, () => {
    setGameData({
      ...gameData,
      states: { ...gameData.states, isDayComplete: true },
    });
  });

  useEffect(() => {
    setActiveTutorialTypes([
      TutorialType.WORK_SCREEN,
      TutorialType.WORK_ORDERS,
    ]);
  }, []);

  useEffect(() => {
    if (
      timeLapsed > toMilliseconds(0, 10) &&
      gameData.orderService.getAllOrders().every((o) => !o.isCreated)
    )
      setActiveTutorialTypes([
        TutorialType.WORK_FOLDERS,
        TutorialType.WORK_ITEMS,
      ]);
    if (
      timeLapsed > toMilliseconds(0, 10) &&
      gameData.orderService.getAllOrders().some((o) => o.isCreated) &&
      gameData.git.modifiedItems.length === 0
    )
      setActiveTutorialTypes([TutorialType.WORK_ITEMS]);
    if (
      gameData.git.workingDirectory.createdItems.some(
        (i) => i.ingredients.length > 0
      )
    )
      setActiveTutorialTypes([TutorialType.WORK_TERMINAL]);
    if (
      gameData.states.isDayComplete ||
      gameData.orderService
        .getAllOrders()
        .every((o) => o.percentageCompleted >= 100)
    ) {
      setActiveTutorialTypes([TutorialType.WORK_PUSH]);
    }
  }, [timeLapsed]);

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

export default WorkScreenController;

import React from "react";

import { useTimeLapsed } from "hooks/useTimeLapsed";
import WorkScreen from "components/screens/WorkScreen";
import FileController from "controllers/components/work/ItemController";
import StageController from "controllers/components/work/StageController";
import OrdersController from "controllers/components/work/OrdersController";
import InfoBoxController from "controllers/components/work/InfoBoxController";
import TerminalController from "controllers/components/work/TerminalController";
import DirectoryController from "controllers/components/work/DirectoryController";
import CommitHistoryController from "controllers/components/work/CommitHistoryController";

interface IWorkScreenControllerProps {
  endDay: () => void;
}

const WorkScreenController: React.FC<IWorkScreenControllerProps> = ({
  endDay,
}): JSX.Element => {
  useTimeLapsed(1, 500, () => endDay());

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

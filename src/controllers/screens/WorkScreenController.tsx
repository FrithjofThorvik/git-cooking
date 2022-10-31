import React from "react";

import WorkScreen from "../../components/screens/WorkScreen";
import OrdersController from "../components/work/OrdersController";
import InfoBoxController from "../components/work/InfoBoxController";
import TerminalController from "../components/work/TerminalController";
import FileController from "../components/work/FileController";
import StageController from "../components/work/StageController";
import DirectoryController from "../components/work/DirectoryController";
import CommitHistoryController from "../components/work/CommitHistoryController";

interface IWorkScreenControllerProps {
  goToSummary: () => void;
}

const WorkScreenController: React.FC<IWorkScreenControllerProps> = ({
  goToSummary,
}): JSX.Element => {
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

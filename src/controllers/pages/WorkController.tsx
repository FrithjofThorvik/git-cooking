import React from "react";

import OrdersController from "../components/OrdersController";
import InfoBoxController from "../components/InfoBoxController";
import TerminalController from "../components/TerminalController";
import FileViewController from "../components/FileViewController";
import StageViewController from "../components/StageViewController";
import DirectoryController from "../components/DirectoryController";
import CommitHistoryController from "../components/CommitHistoryController";

import "./WorkController.scss";

interface IWorkControllerProps {
  goToSummary: () => void;
}

const WorkController: React.FC<IWorkControllerProps> = ({
  goToSummary,
}): JSX.Element => {
  return (
    <div className="work">
      <div className="left">
        <DirectoryController />
      </div>
      <div className="middle">
        <div className="topMiddle">
          <div className="topMiddleLeft">
            <FileViewController />
          </div>
          <div className="topMiddleRight">
            <StageViewController />
          </div>
        </div>
        <div className="bottomMiddle">
          <TerminalController />
        </div>
      </div>
      <div className="right">
        <div className="topRight">
          <OrdersController />
        </div>
        <div className="bottomRight">
          <InfoBoxController />
          <CommitHistoryController />
        </div>
      </div>
    </div>
  );
};

export default WorkController;

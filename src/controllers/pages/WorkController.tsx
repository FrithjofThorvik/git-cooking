import React from "react";

import Orders from "../../components/orders/Orders";
import InfoBoxController from "../components/InfoBoxController";
import TerminalController from "../components/TerminalController";
import FileViewController from "../components/FileViewController";
import StageViewController from "../components/StageViewController";
import DirectoryController from "../components/DirectoryController";
import "./WorkController.scss";

interface IWorkControllerProps {}

const WorkController: React.FC<IWorkControllerProps> = (): JSX.Element => {
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
          <Orders />
        </div>
        <div className="bottomRight">
          <InfoBoxController />
        </div>
      </div>
    </div>
  );
};

export default WorkController;

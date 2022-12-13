import React from "react";

import { imgRestaurant } from "assets";
import Background from "components/Background";

import "./WorkScreen.scss";

interface IWorkScreenProps {
  ordersController: JSX.Element;
  infoBoxController: JSX.Element;
  terminalController: JSX.Element;
  fileController: JSX.Element;
  stageController: JSX.Element;
  directoryController: JSX.Element;
  commitHistoryController: JSX.Element;
}

const WorkScreen: React.FC<IWorkScreenProps> = ({
  ordersController,
  infoBoxController,
  terminalController,
  fileController,
  stageController,
  directoryController,
  commitHistoryController,
}): JSX.Element => {
  return (
    <Background img={imgRestaurant} opacity={0.75} blur={0}>
      <div className="work-screen">
        <div className="work-screen-left">{directoryController}</div>
        <div className="work-screen-middle">
          <div className="work-screen-middle-top">
            <div className="work-screen-middle-top-left">{fileController}</div>
            <div className="work-screen-middle-top-right">
              {stageController}
            </div>
          </div>
          <div className="work-screen-middle-bottom">{terminalController}</div>
        </div>
        <div className="work-screen-right">
          <div className="work-screen-right-top">{ordersController}</div>
          <div className="work-screen-right-bottom">
            {infoBoxController}
            {commitHistoryController}
          </div>
        </div>
      </div>
    </Background>
  );
};

export default WorkScreen;

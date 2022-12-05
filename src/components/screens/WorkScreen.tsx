import React from "react";

import { imgRestaurant } from "assets";
import { TutorialType } from "types/enums";
import Tutorials from "components/Tutorials";
import Background from "components/Background";
import HelpButton from "components/HelpButton";

import { IHelp, ITutorial } from "types/gameDataInterfaces";

import "./WorkScreen.scss";

interface IWorkScreenProps {
  help: IHelp;
  ordersController: JSX.Element;
  infoBoxController: JSX.Element;
  terminalController: JSX.Element;
  fileController: JSX.Element;
  stageController: JSX.Element;
  directoryController: JSX.Element;
  commitHistoryController: JSX.Element;
  pauseGameTime: (isPaused: boolean) => void;
  openHelpScreen: () => void;
  completeTutorial: (tutorial: ITutorial) => void;
}

const WorkScreen: React.FC<IWorkScreenProps> = ({
  help,
  ordersController,
  infoBoxController,
  terminalController,
  fileController,
  stageController,
  directoryController,
  commitHistoryController,
  pauseGameTime,
  openHelpScreen,
  completeTutorial,
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
        <Tutorials
          tutorials={help.getTutorialsByTypes([TutorialType.STORE_INGREDIENTS])}
          completeTutorial={completeTutorial}
          hideOnCompletion
          stopGameTime
          pauseGameTime={pauseGameTime}
        />
        <HelpButton onClick={openHelpScreen} isOpen={false} />
      </div>
    </Background>
  );
};

export default WorkScreen;

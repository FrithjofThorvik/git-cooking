import React, { useState } from "react";

import { imgLibrary } from "assets";
import { useKeyPress } from "hooks/useKeyPress";
import { HelpScreenType } from "types/enums";
import { IHelp, ITutorial } from "types/gameDataInterfaces";
import HelpNav from "components/help/HelpNav";
import Tutorials from "components/Tutorials";
import HelpButton from "components/HelpButton";
import Background from "components/Background";
import CommandList from "components/help/HelpCommands";
import HelpConcepts from "components/help/HelpConcepts";
import HelpTutorials from "components/help/HelpTutorials";

import "./HelpScreen.scss";

interface IHelpScreenProps {
  help: IHelp;
  closeHelpScreen: () => void;
}

const HelpScreen: React.FC<IHelpScreenProps> = ({
  help,
  closeHelpScreen,
}): JSX.Element => {
  const [activeTutorials, setActiveTutorials] = useState<ITutorial[]>([]);
  const [activeHelpScreen, setActiveHelpScreen] = useState<HelpScreenType>(
    HelpScreenType.TUTORIALS
  );
  useKeyPress(
    "Escape",
    () => activeTutorials.length === 0 && closeHelpScreen()
  );

  const getActiveHelpScreen = () => {
    switch (activeHelpScreen) {
      case HelpScreenType.TUTORIALS:
        return (
          <HelpTutorials
            tutorials={help.tutorials}
            setActiveTutorials={(t: ITutorial[]) => setActiveTutorials(t)}
          />
        );
      case HelpScreenType.COMMANDS:
        return <CommandList />;
      case HelpScreenType.CONCEPTS:
        return <HelpConcepts />;
      default:
        return <></>;
    }
  };

  return (
    <Background img={imgLibrary} blur={8} opacity={0.75}>
      <div className="help-screen">
        {getActiveHelpScreen()}
        <HelpNav
          activeHelpScreen={activeHelpScreen}
          setActiveHelpScreen={(hs: HelpScreenType) => setActiveHelpScreen(hs)}
        />
        <Tutorials
          setActiveTutorialTypes={() => {
            //do nothing
          }}
          unlockedTutorials={[]}
          tutorials={activeTutorials}
          hideOnLastTutorial
          onCompletion={() => setActiveTutorials([])}
        />
        <HelpButton onClick={closeHelpScreen} isOpen />
      </div>
    </Background>
  );
};

export default HelpScreen;

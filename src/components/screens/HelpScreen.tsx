import React, { useState } from "react";

import { IHelp, ITutorial } from "types/gameDataInterfaces";
import { imgLibrary } from "assets";
import Tutorials from "components/Tutorials";
import HelpButton from "components/HelpButton";

import "./HelpScreen.scss";
import Background from "components/Background";

interface IHelpScreenProps {
  help: IHelp;
  closeHelpScreen: () => void;
  completeTutorial: (tutorial: ITutorial) => void;
}

const HelpScreen: React.FC<IHelpScreenProps> = ({
  help,
  closeHelpScreen,
  completeTutorial,
}): JSX.Element => {
  const [activeTutorials, setActiveTutorials] = useState<ITutorial[]>([]);

  return (
    <Background img={imgLibrary} blur={10} opacity={0.8}>
      <div className="help-screen">
        <div className="help-screen-tutorials">
          {help.tutorials.map((t, i) => (
            <div
              key={i}
              className="help-screen-tutorials-tutorial"
              onClick={() => setActiveTutorials([t])}
            >
              <div className="help-screen-tutorials-tutorial-title">
                {t.type}
              </div>
              <div className="help-screen-tutorials-tutorial-description">
                {t.description}
              </div>
              <div className="help-screen-tutorials-tutorial-play">→</div>
            </div>
          ))}
        </div>
        <Tutorials
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

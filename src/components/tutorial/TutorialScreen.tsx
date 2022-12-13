import React from "react";

import { ITutorial, ITutorialScreen } from "types/gameDataInterfaces";
import TutorialPrompt from "./TutorialPrompt";
import TutorialScreenNav from "./TutorialScreenNav";

import "./TutorialScreen.scss";

interface ITutorialScreenProps {
  tutorial: ITutorial;
  screen: ITutorialScreen;
  screenIndex: number;
  prompt: string;
  promptIndex: number;
  nextPrompt: () => void;
  prevPrompt: () => void;
  typewriter?: boolean;
}

const TutorialScreen: React.FC<ITutorialScreenProps> = ({
  tutorial,
  screen,
  screenIndex,
  prompt,
  promptIndex,
  nextPrompt,
  prevPrompt,
  typewriter = false,
}): JSX.Element => {
  return (
    <div className="tutorial-screen">
      {screen.img && (
        <div className="tutorial-screen-image">
          <img src={screen.img} alt={screen.title} />
        </div>
      )}
      <TutorialPrompt text={prompt} typewriter={typewriter} />
      <TutorialScreenNav
        tutorial={tutorial}
        screenIndex={screenIndex}
        promptIndex={promptIndex}
        nextPrompt={nextPrompt}
        prevPrompt={prevPrompt}
      />
    </div>
  );
};

export default TutorialScreen;

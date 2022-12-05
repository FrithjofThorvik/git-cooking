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
}

const TutorialScreen: React.FC<ITutorialScreenProps> = ({
  tutorial,
  screen,
  screenIndex,
  prompt,
  promptIndex,
  nextPrompt,
  prevPrompt,
}): JSX.Element => {
  return (
    <div className="tutorial-screen">
      <img src={screen.img} alt={screen.title} />
      <TutorialPrompt text={prompt} />
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

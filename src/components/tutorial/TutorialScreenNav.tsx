import { useKeyPress } from "hooks/useKeyPress";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { ITutorial } from "types/gameDataInterfaces";

import "./TutorialScreenNav.scss";

interface ITutorialScreenNavProps {
  tutorial: ITutorial;
  screenIndex: number;
  promptIndex: number;
  nextPrompt: () => void;
  prevPrompt: () => void;
}

const TutorialScreenNav: React.FC<ITutorialScreenNavProps> = ({
  tutorial,
  screenIndex,
  promptIndex,
  nextPrompt,
  prevPrompt,
}): JSX.Element => {
  useKeyPress("Enter", () => nextPrompt());
  useKeyPress("ArrowRight", () => nextPrompt());

  useKeyPress("Backspace", () => prevPrompt());
  useKeyPress("ArrowLeft", () => prevPrompt());

  return (
    <div className="tutorial-screen-nav">
      <NavigateNextIcon
        className="tutorial-screen-nav-prev"
        onClick={() => prevPrompt()}
      />
      {tutorial.screens.map((s, sIdx) => {
        return s.prompts.map((p, pIdx) => {
          return (
            <div
              key={sIdx * (pIdx + 1)}
              className={`tutorial-screen-nav-dot ${
                sIdx === screenIndex && pIdx === promptIndex ? "active" : ""
              }`}
            ></div>
          );
        });
      })}
      <NavigateNextIcon
        className="tutorial-screen-nav-next"
        onClick={() => nextPrompt()}
      />
    </div>
  );
};

export default TutorialScreenNav;

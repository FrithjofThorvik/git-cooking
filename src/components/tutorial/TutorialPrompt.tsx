import React from "react";

import { imgChef } from "assets";

import "./TutorialPrompt.scss";

interface ITutorialPromptProps {
  text: string;
}

const TutorialPrompt: React.FC<ITutorialPromptProps> = ({
  text,
}): JSX.Element => {
  return (
    <div className="tutorial-prompt">
      <div className="tutorial-prompt-box">
        <p className="tutorial-prompt-box-text">{text}</p>
        <img src={imgChef} alt="Chef" />
        <p className="tutorial-prompt-box-next">{"[ENTER] → Next"}</p>
        <p className="tutorial-prompt-box-back">{"Prev ← [BACKSPACE]"}</p>
      </div>
    </div>
  );
};

export default TutorialPrompt;

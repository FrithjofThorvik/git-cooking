import React from "react";
import Typewriter from "typewriter-effect";
import ReactDOMServer from "react-dom/server";

import { imgChef } from "assets";
import HighlightText from "components/HighlightText";

import "./TutorialPrompt.scss";

interface ITutorialPromptProps {
  text: string;
  typewriter?: boolean;
}

const TutorialPrompt: React.FC<ITutorialPromptProps> = ({
  text,
  typewriter = false,
}): JSX.Element => {
  return (
    <div className="tutorial-prompt">
      <div className="tutorial-prompt-box">
        <div className="tutorial-prompt-box-text">
          {typewriter ? (
            <Typewriter
              options={{
                strings: ReactDOMServer.renderToStaticMarkup(
                  <HighlightText text={text} />
                ),
                autoStart: true,
                loop: false,
                delay: 5,
                cursor: "",
              }}
            />
          ) : (
            <HighlightText text={text} />
          )}
        </div>
        <img src={imgChef} alt="Chef" />
        <p className="tutorial-prompt-box-next">{"[ENTER] → Next"}</p>
        <p className="tutorial-prompt-box-back">{"Prev ← [BACKSPACE]"}</p>
      </div>
    </div>
  );
};

export default TutorialPrompt;

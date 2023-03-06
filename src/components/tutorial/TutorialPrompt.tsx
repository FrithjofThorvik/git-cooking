import React, { useRef } from "react";
import Typewriter from "typewriter-effect";
import ReactDOMServer from "react-dom/server";

import { imgChef } from "assets";
import HighlightText from "components/HighlightText";

import "./TutorialPrompt.scss";

interface ITutorialPromptProps {
  text: string;
  hideGoBack: boolean;
  typewriter?: boolean;
  setShowTypewrite: (value: boolean) => void;
}

const TutorialPrompt: React.FC<ITutorialPromptProps> = ({
  text,
  hideGoBack,
  typewriter = false,
  setShowTypewrite,
}): JSX.Element => {
  const typewriteRef = useRef<HTMLDivElement>(null);
  const strippedText = text.replaceAll("%", "");

  var customNodeCreator = function (character: string) {
    // custom part - check if string is typed out
    const textContent = typewriteRef.current?.textContent;
    const nextTextContent = textContent + character;
    if (nextTextContent === strippedText) setShowTypewrite(false);

    // default part
    return document.createTextNode(character);
  };

  return (
    <div className="tutorial-prompt">
      <div className="tutorial-prompt-box">
        <div className="tutorial-prompt-box-text" ref={typewriteRef}>
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
                onCreateTextNode: customNodeCreator,
              }}
            />
          ) : (
            <HighlightText text={text} />
          )}
        </div>
        <img src={imgChef} alt="Chef" />
        <p className="tutorial-prompt-box-next">{"[ENTER] → Next"}</p>
        <p className="tutorial-prompt-box-back">
          {hideGoBack ? "" : "Prev ← [BACKSPACE]"}
        </p>
      </div>
    </div>
  );
};

export default TutorialPrompt;

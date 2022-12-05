import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { ITutorial } from "types/gameDataInterfaces";

import "./TutorialsNav.scss";

interface ITutorialsNavProps {
  tutorials: ITutorial[];
  tutorial: ITutorial;
  next: () => void;
  prev: () => void;
  setTutorial: (tutorial: ITutorial) => void;
}

const TutorialsNav: React.FC<ITutorialsNavProps> = ({
  tutorials,
  tutorial,
  next,
  prev,
  setTutorial,
}): JSX.Element => {
  return (
    <div className="tutorials-nav">
      {/* <div className="tutorials-nav-button" onClick={() => prev()}>
        {"<"}
      </div> */}
      {tutorials.map((t, i) => (
        <div
          className={`tutorials-nav-item ${
            tutorial.type === t.type ? "active" : ""
          }`}
          key={i}
        >
          <div
            className="tutorials-nav-item-content"
            onClick={() => setTutorial(t)}
          >
            {t.type}
          </div>
          {i < tutorials.length - 1 && (
            <ArrowForwardIosIcon className="tutorials-nav-item-icon" />
          )}
        </div>
      ))}
      {/* <div className="tutorials-nav-button" onClick={() => next()}>
        {">"}
      </div> */}
    </div>
  );
};

export default TutorialsNav;

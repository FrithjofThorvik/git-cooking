import React from "react";

import { ITutorial } from "types/gameDataInterfaces";

import "./HelpTutorials.scss";

interface IHelpTutorialsProps {
  tutorials: ITutorial[];
  setActiveTutorials: (t: ITutorial[]) => void;
}

const HelpTutorials: React.FC<IHelpTutorialsProps> = ({
  tutorials,
  setActiveTutorials,
}): JSX.Element => {
  return (
    <div className="help-tutorials">
      {tutorials.map((t, i) => (
        <div
          key={i}
          className="help-tutorials-card"
          onClick={() => setActiveTutorials([t])}
        >
          <div className="help-tutorials-card-title">{t.type}</div>
          <div className="help-tutorials-card-description">{t.description}</div>
          <div className="help-tutorials-card-play">→</div>
        </div>
      ))}
    </div>
  );
};

export default HelpTutorials;

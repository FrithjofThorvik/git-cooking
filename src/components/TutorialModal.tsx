import { imgChef } from "assets";
import { useEffect, useState } from "react";
import { TutorialType } from "types/enums";
import { ITutorial } from "types/gameDataInterfaces";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { KeyboardArrowDown } from "@mui/icons-material";

import "./TutorialModal.scss";

interface ITutorialModalProps {
  unlockedTutorials: ITutorial[];
  handleClick: (tutorialTypes: TutorialType[]) => void;
}

const TutorialModal: React.FC<ITutorialModalProps> = ({
  unlockedTutorials,
  handleClick,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [tutorialLength, setTutorialLength] = useState<number>(0);
  const [activateFlash, setActivateFlash] = useState<boolean>(false);

  useEffect(() => {
    if (
      unlockedTutorials.every(
        (t) =>
          t.type === TutorialType.GAME_INTRO || t.type === TutorialType.TERMINAL
      )
    ) {
      // show the intro and terminal tutorial by default
      handleClick(unlockedTutorials.map((t) => t.type));
    }
    if (unlockedTutorials.length !== tutorialLength) {
      setActivateFlash(true);
      setTimeout(() => setActivateFlash(false), 2000);
    }
    setTutorialLength(tutorialLength);
  }, [unlockedTutorials.length]);

  return (
    <div className="tutorial-modal">
      {activateFlash && (
        <div className="tutorial-modal-text">
          New tutorial
          <KeyboardArrowDown />
        </div>
      )}
      <div className={`tutorial-modal-count   ${activateFlash ? "new" : ""}`}>
        {unlockedTutorials.length}
      </div>
      <div className="tutorial-modal-circle">
        <img
          src={imgChef}
          alt="Chef"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
          onClick={() => handleClick(unlockedTutorials.map((t) => t.type))}
        />
      </div>
      <div
        className={`tutorial-modal-menu ${showMenu ? "show" : "hide"}`}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <div className="tutorial-modal-menu-title">New tutorials</div>
        {unlockedTutorials.map((t, i) => (
          <div
            key={t.type}
            className="tutorial-modal-menu-item"
            onClick={() => handleClick([t.type])}
          >
            {`${i + 1}. ${t.type}`}
          </div>
        ))}
        <div
          className="tutorial-modal-menu-view"
          onClick={() => handleClick(unlockedTutorials.map((t) => t.type))}
        >
          <p>OPEN ALL</p>
          <ArrowRightAltIcon />
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;

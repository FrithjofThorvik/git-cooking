import React, { useEffect, useState } from "react";
import CodeTwoToneIcon from "@mui/icons-material/CodeTwoTone";
import SchoolTwoToneIcon from "@mui/icons-material/SchoolTwoTone";

import { HelpScreenType } from "types/enums";

import "./HelpNav.scss";
import InfoText from "components/InfoText";

interface IHelpNavProps {
  activeHelpScreen: HelpScreenType;
  setActiveHelpScreen: (t: HelpScreenType) => void;
}

const HelpNav: React.FC<IHelpNavProps> = ({
  activeHelpScreen,
  setActiveHelpScreen,
}): JSX.Element => {
  const [activeText, setActiveText] = useState<string>("");

  useEffect(() => {
    switch (activeHelpScreen) {
      case HelpScreenType.TUTORIALS:
        setActiveText(
          "This is a list of %all the tutorials% presented in the game"
        );
        break;
      case HelpScreenType.COMMANDS:
        setActiveText(
          "This is a list of all the %git commands% that can be used in the game"
        );
        break;
      default:
        break;
    }
  }, [activeHelpScreen]);

  return (
    <div className="help-nav">
      <InfoText text={activeText} />
      <div className="help-nav-filters">
        <div
          className={`help-nav-filters-filter ${
            activeHelpScreen === HelpScreenType.TUTORIALS ? "selected" : ""
          }`}
          onClick={() => setActiveHelpScreen(HelpScreenType.TUTORIALS)}
        >
          <SchoolTwoToneIcon /> <p>Tutorials</p>
        </div>
        <div
          className={`help-nav-filters-filter ${
            activeHelpScreen === HelpScreenType.COMMANDS ? "selected" : ""
          }`}
          onClick={() => setActiveHelpScreen(HelpScreenType.COMMANDS)}
        >
          <CodeTwoToneIcon /> <p>Command List</p>
        </div>
      </div>
    </div>
  );
};

export default HelpNav;

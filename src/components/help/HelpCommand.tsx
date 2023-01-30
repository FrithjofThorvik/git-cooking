import React, { useState } from "react";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";

import { IGitCommand } from "types/gameDataInterfaces";
import HighlightText from "components/HighlightText";

import "./HelpCommand.scss";

interface IHelpCommandProps {
  gitCommand: IGitCommand;
}

const HelpCommand: React.FC<IHelpCommandProps> = ({
  gitCommand,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`help-command ${isOpen ? "open" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="help-command-name">
        <ChevronRightTwoToneIcon />
        <p>{gitCommand.name()}</p>
      </div>
      <div className="help-command-description">{gitCommand.description()}</div>
      {isOpen && (
        <>
          <div className="help-command-usecase">
            <HighlightText text={gitCommand.useCase} />
          </div>
        </>
      )}
    </div>
  );
};

export default HelpCommand;

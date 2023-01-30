import React from "react";

import { defaultGitCommands } from "data/defaultGitCommands";
import HelpCommand from "./HelpCommand";

import "./HelpCommands.scss";

interface IHelpCommandsProps {}

const HelpCommands: React.FC<IHelpCommandsProps> = (): JSX.Element => {
  return (
    <div className="help-commands">
      {defaultGitCommands.map((c, i) => (
        <HelpCommand key={i} gitCommand={c} />
      ))}
    </div>
  );
};

export default HelpCommands;

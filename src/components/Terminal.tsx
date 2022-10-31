import React from "react";

import "./Terminal.scss";

interface ITerminalProps {}

const Terminal: React.FC<ITerminalProps> = (): JSX.Element => {
  return (
    <div className="terminalContainer">
      <div className="terminalContent">Hello</div>
    </div>
  );
};

export default Terminal;

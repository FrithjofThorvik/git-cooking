import React from "react";

import "./Terminal.scss";

interface ITerminalProps {
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  value: string;
  history: string[];
  bottomRef: React.RefObject<HTMLDivElement> | null;
}

const Terminal: React.FC<ITerminalProps> = ({
  handleKeyDown,
  handleChange,
  value,
  history,
  bottomRef,
}): JSX.Element => {
  return (
    <div className="terminalContainer">
      <div className="terminalContent">
        <div className="terminalHistory">
          {history.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="terminalInputArea">
          <span>{">"}</span>
          <input
            className="terminalInput"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

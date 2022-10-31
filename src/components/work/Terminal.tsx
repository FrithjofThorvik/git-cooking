import React, { useRef, useEffect } from "react";

import "./Terminal.scss";

interface ITerminalProps {
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  value: string;
  history: string[];
}

const Terminal: React.FC<ITerminalProps> = ({
  handleKeyDown,
  handleChange,
  value,
  history,
}): JSX.Element => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom every time history change
    // bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="terminal">
      <div className="terminal-content">
        <div className="terminal-content-history">
          {history.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="terminal-content-input">
          <span>{">"}</span>
          <input
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

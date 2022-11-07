import React, { useRef, useEffect, useState } from "react";
import { IGitCooking } from "types/gameDataInterfaces";

import { IGitResponse } from "types/interfaces";

import "./Terminal.scss";

interface ITerminalProps {
  parseCommand: (gameData: IGitCooking, command: string) => IGitResponse;
  gameData: IGitCooking;
}

const Terminal: React.FC<ITerminalProps> = ({
  parseCommand,
  gameData,
}): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [terminalDisplay, setTerminalDisplay] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const traverseHistory = (step: number) => {
    let newIndex = commandHistoryIndex + step;

    if (newIndex <= -1) newIndex = -1;
    else if (newIndex > commandHistory.length - 1)
      newIndex = commandHistory.length - 1;
    newIndex === -1 ? setValue("") : setValue(commandHistory[newIndex]);

    setCommandHistoryIndex(newIndex);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        const gitRes = parseCommand(gameData, value);
        setTerminalDisplay((prevState) => prevState + "\n" + gitRes.message);
        setCommandHistory((prevState) => [value, ...prevState]);
        setValue("");
        setCommandHistoryIndex(-1);
        break;

      case "ArrowUp":
        event.preventDefault();
        traverseHistory(1);
        break;

      case "ArrowDown":
        event.preventDefault();
        traverseHistory(-1);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    // scroll to bottom every time history change
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalDisplay]);

  return (
    <div className="terminal">
      <div className="terminal-content">
        <div className="terminal-content-history">
          <p>{terminalDisplay}</p>
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

import { TerminalOutlined } from "@mui/icons-material";
import HighlightText from "components/HighlightText";
import React, { useEffect, useRef, useState } from "react";

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
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const traverseHistory = (step: number) => {
    let newIndex = commandHistoryIndex + step;

    if (newIndex <= -1) newIndex = -1;
    else if (newIndex > gameData.commandHistory.length - 1)
      newIndex = gameData.commandHistory.length - 1;
    newIndex === -1
      ? setValue("")
      : setValue(gameData.commandHistory[newIndex]);

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
        setTerminalDisplay(
          (prevState) => prevState + `\n%> ${value}% \n` + gitRes.message
        );
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

  const focus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    // scroll to bottom every time history change
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalDisplay]);

  return (
    <div className="terminal" onMouseUp={() => focus()}>
      <div className="terminal-content">
        <div className="terminal-content-history">
          <HighlightText text={terminalDisplay} />
          <div ref={bottomRef} />
        </div>
        <div className="terminal-content-input">
          <span>{">"}</span>
          <input
            type="text"
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            id="git-terminal"
          />
        </div>
      </div>
      {!terminalDisplay && (
        <div className="terminal-empty">
          <TerminalOutlined />
          <p>Terminal</p>
        </div>
      )}
    </div>
  );
};

export default Terminal;

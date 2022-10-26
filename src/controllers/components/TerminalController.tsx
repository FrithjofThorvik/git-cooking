import React, { useEffect, useRef, useState } from "react";

import Terminal from "../../components/Terminal";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom every time history change
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = (command: string) => {
    // do something for the command here!
    // return a message to display

    // for now just display the command in history
    setHistory((prevState) => [...prevState, command]);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommand(value);
      setValue("");
    }
  };

  return (
    <Terminal
      handleChange={onChange}
      handleKeyDown={onKeyDown}
      value={value}
      history={history}
      bottomRef={bottomRef}
    />
  );
};

export default TerminalController;

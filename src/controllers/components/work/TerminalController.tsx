import React, { useState } from "react";

import Terminal from "components/work/Terminal";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

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
    />
  );
};

export default TerminalController;

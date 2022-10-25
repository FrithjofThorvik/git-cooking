import React from "react";

import Terminal from "../../components/Terminal";

interface ITerminalControllerProps {}

const TerminalController: React.FC<
  ITerminalControllerProps
> = (): JSX.Element => {
  return <Terminal />;
};

export default TerminalController;

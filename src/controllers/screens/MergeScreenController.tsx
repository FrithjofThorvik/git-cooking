import React from "react";

import MergeScreen from "components/screens/MergeScreen";
import TerminalController from "controllers/components/work/TerminalController";

interface IMergeScreenControllerProps {
  goNext: () => void;
}

const MergeScreenController: React.FC<IMergeScreenControllerProps> = ({
  goNext,
}): JSX.Element => {
  return (
    <MergeScreen terminalController={<TerminalController />} goNext={goNext} />
  );
};

export default MergeScreenController;

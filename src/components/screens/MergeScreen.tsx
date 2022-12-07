import React from "react";

import Background from "components/Background";

import "./MergeScreen.scss";

interface IMergeScreenProps {
  goNext: () => void;
  terminalController: JSX.Element;
}

const MergeScreen: React.FC<IMergeScreenProps> = ({
  goNext,
  terminalController,
}): JSX.Element => {
  return (
    <Background>
      <div className="merge-screen">
        <div className="merge-screen-content">
          <p>MERGE</p>
          <button onClick={() => goNext()}>SUMMARY</button>
        </div>
        <div className="merge-screen-terminal">{terminalController}</div>
      </div>
    </Background>
  );
};

export default MergeScreen;

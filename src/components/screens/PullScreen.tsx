import React from "react";

import { IRemote } from "types/gitInterfaces";
import Background from "components/Background";
import RemoteBranch from "components/pull/RemoteBranch";

import "./PullScreen.scss";

interface IPullScreenProps {
  remote: IRemote;
  terminalController: JSX.Element;
}

const PullScreen: React.FC<IPullScreenProps> = ({
  terminalController,
  remote,
}): JSX.Element => {
  return (
    <Background>
      <div className="pull-screen">
        <div className="pull-screen-content">
          <div className="pull-screen-content-branches">
            {remote.branches.map((rb, i) => (
              <RemoteBranch
                key={i}
                branch={rb}
                stats={remote.getBranchStats(rb)}
              />
            ))}
          </div>
        </div>
        <div className="pull-screen-terminal">{terminalController}</div>
      </div>
    </Background>
  );
};

export default PullScreen;

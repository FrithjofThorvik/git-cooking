import React from "react";

import { IRemote } from "types/gitInterfaces";
import Background from "components/Background";
import RemoteBranch from "components/fetch/RemoteBranch";

import "./FetchScreen.scss";

interface IFetchScreenProps {
  remote: IRemote;
  terminalController: JSX.Element;
}

const FetchScreen: React.FC<IFetchScreenProps> = ({
  terminalController,
  remote,
}): JSX.Element => {
  const fetchedBranches = remote.branches.filter((rb) => rb.isFetched);
  return (
    <Background>
      <div className="fetch-screen">
        <div className="fetch-screen-content">
          {fetchedBranches.length > 0 ? (
            <div className="fetch-screen-content-branches">
              {fetchedBranches.map((rb, i) => (
                <RemoteBranch
                  key={i}
                  branch={rb}
                  stats={remote.getBranchStats(rb)}
                />
              ))}
            </div>
          ) : (
            <div className="fetch-screen-content-info">Fetch orders</div>
          )}
        </div>
        <div className="fetch-screen-terminal">{terminalController}</div>
      </div>
    </Background>
  );
};

export default FetchScreen;

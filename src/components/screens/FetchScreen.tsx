import React from "react";
import CloudDownloadTwoToneIcon from "@mui/icons-material/CloudDownloadTwoTone";

import { IRemote } from "types/gitInterfaces";
import InfoText from "components/InfoText";
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
            <>
              <div className="fetch-screen-content-branches">
                {fetchedBranches.map((rb, i) => (
                  <RemoteBranch key={i} branch={rb} />
                ))}
              </div>
              <div className="fetch-screen-content-text">
                <InfoText text="Navaigate to the restaurant you want with %git checkout <branch>% to start your day" />
              </div>
            </>
          ) : (
            <div className="fetch-screen-content-info">
              <CloudDownloadTwoToneIcon />
              <p>Waiting for fetch ...</p>
              <InfoText text="A new day is about to start! Fetch today's orders with %git fetch% and get started " />
            </div>
          )}
        </div>
        <div className="fetch-screen-terminal">{terminalController}</div>
      </div>
    </Background>
  );
};

export default FetchScreen;

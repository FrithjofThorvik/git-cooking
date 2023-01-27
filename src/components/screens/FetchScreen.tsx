import { ThemeProvider, Tooltip } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudDownloadTwoToneIcon from "@mui/icons-material/CloudDownloadTwoTone";

import { theme } from "styles/muiThemes";
import { IRemote } from "types/gitInterfaces";
import InfoText from "components/InfoText";
import Background from "components/Background";
import RemoteBranch from "components/fetch/RemoteBranch";

import "./FetchScreen.scss";

interface IFetchScreenProps {
  remote: IRemote;
  terminalController: JSX.Element;
  isFirstDay: boolean;
  goBack: () => void;
}

const FetchScreen: React.FC<IFetchScreenProps> = ({
  terminalController,
  remote,
  isFirstDay,
  goBack,
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
        {!isFirstDay && (
          <div className="fetch-screen-return" onClick={() => goBack()}>
            <ThemeProvider theme={theme}>
              <Tooltip title={"Shop"}>
                <ArrowBackIcon className="fetch-screen-return-button" />
              </Tooltip>
            </ThemeProvider>
          </div>
        )}
      </div>
    </Background>
  );
};

export default FetchScreen;

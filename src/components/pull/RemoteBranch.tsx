import { ThemeProvider, Tooltip } from "@mui/material";
import React from "react";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { theme } from "styles/muiThemes";
import { formatNumber } from "services/helpers";
import { IRemoteBranch, IRemoteBranchStats } from "types/gitInterfaces";

import "./RemoteBranch.scss";

interface IRemoteBranchProps {
  branch: IRemoteBranch;
  stats: IRemoteBranchStats;
}

const RemoteBranch: React.FC<IRemoteBranchProps> = ({
  branch,
  stats,
}): JSX.Element => {
  return (
    <div className="remote-branch">
      <div className="remote-branch-content">
        <div className="remote-branch-content-top">
          <div className="remote-branch-content-top-title">{branch.name}</div>
          <div className="remote-branch-content-top-content">
            <div className="remote-branch-content-top-content-item">
              <p className="remote-branch-content-top-content-item-title">
                Customers
              </p>
              <div className="remote-branch-content-top-content-item-images">
                {stats.orders.map((o) => (
                  <div
                    key={o.id}
                    className="remote-branch-content-top-content-item-images-image"
                  >
                    <img src={o.image} alt="customer" />
                  </div>
                ))}
              </div>
            </div>
            <div className="remote-branch-content-top-content-seperator"></div>
            <div className="remote-branch-content-top-content-item">
              {stats.missingIngredients.length > 0 ? (
                <>
                  <p className="remote-branch-content-top-content-item-title">
                    Missing Ingredients
                  </p>
                  <div className="remote-branch-content-top-content-item-images">
                    <ThemeProvider theme={theme}>
                      {stats.missingIngredients.map((i) => (
                        <Tooltip key={i.id} title={i.name} arrow>
                          <div className="remote-branch-content-top-content-item-images-image">
                            <img src={i.image} alt={i.name} />
                            <NewReleasesIcon />
                          </div>
                        </Tooltip>
                      ))}
                    </ThemeProvider>
                  </div>
                </>
              ) : (
                <p>No missing ingredients</p>
              )}
            </div>
          </div>
        </div>
        <div className="remote-branch-content-bottom">
          <div className="remote-branch-content-bottom-info">
            <div className="remote-branch-content-bottom-info-stat">
              <p>Total items: </p>
              <p>{stats.itemCount}</p>
            </div>
            <hr />
            <div className="remote-branch-content-bottom-info-stat">
              <p>Max profit: </p>
              <div className="remote-branch-content-bottom-info-stat-label">
                <PaidOutlinedIcon />
                <p> {formatNumber(stats.maxProfit, true)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteBranch;

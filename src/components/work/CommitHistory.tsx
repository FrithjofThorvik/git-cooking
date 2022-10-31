import React from "react";
import Tooltip from "@mui/material/Tooltip";

import { ICommitHistory, ICommit } from "../../types/interfaces";

import "./CommitHistory.scss";

interface ICommitHistoryProps {
  commitHistory: ICommitHistory;
  handleClick: (commit: ICommit) => any;
}
const CommitHistory: React.FC<ICommitHistoryProps> = ({
  commitHistory,
  handleClick,
}): JSX.Element => {
  return (
    <div className="commit-history">
      <div className="commit-history-content">
        {commitHistory.commits.map((commit) => (
          <Commit commit={commit} key={commit.id} handleClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

interface ICommitProps {
  commit: ICommit;
  handleClick: (commit: ICommit) => any;
}
const Commit: React.FC<ICommitProps> = ({
  commit,
  handleClick,
}): JSX.Element => {
  return (
    <Tooltip title={commit.message} placement="top" arrow>
      <div>
        <div className="commit" onClick={() => handleClick(commit)}>
          <p className="commit-text">{commit.id}</p>
        </div>
      </div>
    </Tooltip>
  );
};

export default CommitHistory;

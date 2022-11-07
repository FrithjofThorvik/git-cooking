import React from "react";
import Tooltip from "@mui/material/Tooltip";

import { ICommit } from "types/gameDataInterfaces";

import "./CommitHistory.scss";

interface ICommitHistoryProps {
  commits: ICommit[];
  handleClick: (commit: ICommit) => any;
}
const CommitHistory: React.FC<ICommitHistoryProps> = ({
  commits,
  handleClick,
}): JSX.Element => {
  return (
    <div className="commit-history">
      <div className="commit-history-content">
        {commits.map((commit, i) => (
          <Commit
            commit={commit}
            index={i}
            key={commit.id}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

interface ICommitProps {
  commit: ICommit;
  index: number;
  handleClick: (commit: ICommit) => any;
}
const Commit: React.FC<ICommitProps> = ({
  commit,
  index,
  handleClick,
}): JSX.Element => {
  return (
    <Tooltip title={commit.message} placement="top" arrow>
      <div>
        <div className="commit" onClick={() => handleClick(commit)}>
          <p className="commit-text">{`C${index + 1}`}</p>
        </div>
      </div>
    </Tooltip>
  );
};

export default CommitHistory;

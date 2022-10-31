import React from "react";
import { ICommitHistory, ICommit } from "../types/interfaces";
import Tooltip from "@mui/material/Tooltip";

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
    <div className="commitHistoryContainer">
      <div className="commitHistoryContent">
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
          <p className="commitText">{commit.id}</p>
        </div>
      </div>
    </Tooltip>
  );
};

export default CommitHistory;

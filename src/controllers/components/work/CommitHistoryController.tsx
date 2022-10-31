import React from "react";

import { ICommit, ICommitHistory } from "types/interfaces";
import CommitHistory from "components/work/CommitHistory";

interface ICommitHistoryControllerProps {}

const CommitHistoryController: React.FC<
  ICommitHistoryControllerProps
> = (): JSX.Element => {
  const commitHistory: ICommitHistory = {
    commits: [
      { message: "first commit", id: "#1" },
      { message: "next commit", id: "#2" },
      { message: "another commit", id: "#3" },
      { message: "look at this commit", id: "#4" },
      { message: "soon done", id: "#5" },
      { message: "six'th commit", id: "#6" },
      { message: "last commit", id: "#7" },
    ],
  };

  const handleClickOnCommit = (commit: ICommit) => {
    alert(`${commit.id}: ${commit.message}`);
  };

  return (
    <CommitHistory
      commitHistory={commitHistory}
      handleClick={handleClickOnCommit}
    />
  );
};

export default CommitHistoryController;

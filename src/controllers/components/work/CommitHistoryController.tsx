import React from "react";

import { ICommit } from "types/gitInterfaces";
import { useGameData } from "hooks/useGameData";
import CommitHistory from "components/work/CommitHistory";

interface ICommitHistoryControllerProps {}

const CommitHistoryController: React.FC<
  ICommitHistoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const handleClickOnCommit = (commit: ICommit) => {
    alert(`${commit.id}: ${commit.message}`);
    console.log(JSON.stringify(commit.directory));
  };
  const commits = gameData.git.getCommitHistory();
  return <CommitHistory commits={commits} handleClick={handleClickOnCommit} />;
};

export default CommitHistoryController;

import React from "react";

import { ICommit } from "types/gameDataInterfaces";
import { useGameData } from "hooks/useGameData";
import CommitHistory from "components/work/CommitHistory";

interface ICommitHistoryControllerProps {}

const CommitHistoryController: React.FC<
  ICommitHistoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const handleClickOnCommit = (commit: ICommit) => {
    alert(`${commit.id}: ${commit.message}`);
  };

  return (
    <CommitHistory
      commits={gameData.gitActiveBranch.commits}
      handleClick={handleClickOnCommit}
    />
  );
};

export default CommitHistoryController;

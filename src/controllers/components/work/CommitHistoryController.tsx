import React, { useEffect, useState } from "react";

import { ICommit } from "types/gitInterfaces";
import { useGameData } from "hooks/useGameData";
import CommitHistory from "components/work/CommitHistory";

interface ICommitHistoryControllerProps {}

const CommitHistoryController: React.FC<
  ICommitHistoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();
  const [commitHistory, setCommitHistory] = useState<ICommit[]>([]);

  const handleClickOnCommit = (commit: ICommit) => {
    alert(`${commit.id}: ${commit.message}`);
    console.log(JSON.stringify(commit.directory));
  };

  useEffect(() => {
    setCommitHistory(gameData.git.getCommitHistory());
  }, [gameData.git.commits]);

  return (
    <CommitHistory commits={commitHistory} handleClick={handleClickOnCommit} />
  );
};

export default CommitHistoryController;

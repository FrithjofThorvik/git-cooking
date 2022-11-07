import React from "react";

import { IFile } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const modifyFile = (file: IFile) => {
    let isValid = true;
    for (let i = 0; i < gameData.gitModifiedFiles.length; i++) {
      if (gameData.gitModifiedFiles[i].path === file.path) isValid = false;
    }
    if (!isValid) {
      alert("File already modified");
      return;
    }
    const newModifiedFiles = gameData.gitModifiedFiles.concat([file]);
    setGameData({ ...gameData, gitModifiedFiles: newModifiedFiles });
  };

  return (
    <Directory
      directory={gameData.directory}
      stagedFiles={gameData.gitStagedFiles}
      modifiedFiles={gameData.gitModifiedFiles}
      modifyFile={modifyFile}
    />
  );
};

export default DirectoryController;

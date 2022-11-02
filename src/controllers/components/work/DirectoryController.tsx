import React from "react";

import { IDirectory } from "types/interfaces";
import { useGameData } from "hooks/useGameData";
import DirectorySidebar from "components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const { gameData, setGameData } = useGameData();

  const directory: IDirectory = {
    folders: [],
    files: [],
  };

  return <DirectorySidebar directory={directory} />;
};

export default DirectoryController;

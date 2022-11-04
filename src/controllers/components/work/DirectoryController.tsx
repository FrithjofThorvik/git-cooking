import React from "react";

import { useGameData } from "hooks/useGameData";
import DirectorySidebar from "components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const { gameData, setGameData } = useGameData();

  return <DirectorySidebar directory={gameData.directory} />;
};

export default DirectoryController;

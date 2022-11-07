import React from "react";

import { Item } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const modifyOrderItem = (item: Item) => {
    let isValid = true;
    for (let i = 0; i < gameData.gitModifiedItems.length; i++) {
      if (gameData.gitModifiedItems[i].path === item.path) isValid = false;
    }
    if (!isValid) {
      alert("Item already modified");
      return;
    }
    const newModifiedItems = gameData.gitModifiedItems.concat([item]);
    setGameData({ ...gameData, gitModifiedItems: newModifiedItems });
  };

  const createOrderFolder = () => {
    // const name = gameData.directory.folders.
  };

  const createOrderFile = () => {};

  const openFile = (path: string) => {
    // if (gameData.selectedItems.map((s) => s.path).includes(path)) return;
    // const updatedSelectedFiles = gameData.selectedItems.concat([path]);
    // setGameData({ ...gameData, selectedItems: updatedSelectedFiles });
  };

  const closeFile = (path: string) => {
    // if (!gameData.selectedItems.map((s) => s.path).includes(path)) return;
    // const updatedSelectedFiles = gameData.selectedItems.filter(
    //   (p) => p.path !== path
    // );
    // setGameData({ ...gameData, selectedItems: updatedSelectedFiles });
  };

  return (
    <Directory
      directory={gameData.directory}
      stagedItems={gameData.gitStagedItems}
      modifiedItems={gameData.gitModifiedItems}
      modifyOrderItem={modifyOrderItem}
    />
  );
};

export default DirectoryController;

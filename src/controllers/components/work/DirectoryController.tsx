import React from "react";

import {
  createNewOrderItem,
  doesOrderItemExist,
} from "services/gameDataHelper";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const createOrderFolder = (order: IOrder) => {
    const updatedDirectory =
      gameData.git.workingDirectory.createOrderFolder(order);

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedDirectory,
      },
    });
  };

  const createOrderItem = (order: IOrder, name: string) => {
    if (doesOrderItemExist(order, name)) return;

    const newOrderItem: IOrderItem = createNewOrderItem(order, name);
    const updatedModifiedItems = gameData.git.handleModifyItem(newOrderItem);
    const updatedDirectory = gameData.git.workingDirectory.addOrderItemToOrder(
      order,
      newOrderItem
    );

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedDirectory,
        modifiedItems: updatedModifiedItems,
      },
    });
  };

  const deleteOrderItem = (orderItem: IOrderItem) => {
    const updatedModifiedItems = gameData.git.handleModifyItem(orderItem, true);
    const updatedDirectory =
      gameData.git.workingDirectory.deleteOrderItem(orderItem);
    const updatedSelectedItems = gameData.selectedItems.filter(
      (id) => id !== orderItem.path
    );

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedDirectory,
        modifiedItems: updatedModifiedItems,
      },
      selectedItems: updatedSelectedItems,
    });
  };

  const selectOrderItem = (orderItem: IOrderItem) => {
    if (gameData.selectedItems.includes(orderItem.path)) return;

    setGameData({
      ...gameData,
      selectedItems: [...gameData.selectedItems, orderItem.path],
    });
  };

  return (
    <Directory
      directory={gameData.git.workingDirectory}
      stagedItems={gameData.git.stagedItems.map((i) => i.item)}
      modifiedItems={gameData.git.modifiedItems.map((i) => i.item)}
      selectOrderItem={selectOrderItem}
      createOrderFolder={createOrderFolder}
      createOrderItem={createOrderItem}
      deleteOrderItem={deleteOrderItem}
    />
  );
};

export default DirectoryController;

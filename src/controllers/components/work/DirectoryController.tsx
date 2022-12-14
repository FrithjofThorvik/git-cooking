import React from "react";

import {
  createNewOrderItem,
  doesOrderItemExistOnOrder,
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
    if (gameData.states.isDayComplete) return;
    const updatedOrderService = gameData.orderService.createOrderFolder(order);
    setGameData({ ...gameData, orderService: updatedOrderService });
  };

  const createOrderItem = (order: IOrder, name: string) => {
    if (gameData.states.isDayComplete) return;
    if (
      doesOrderItemExistOnOrder(
        gameData.git.workingDirectory.createdItems,
        name,
        order
      )
    )
      return;

    const newOrderItem: IOrderItem = createNewOrderItem(order, name);
    const updatedModifiedItems = gameData.git.handleModifyItem(newOrderItem);
    const updatedDirectory =
      gameData.git.workingDirectory.addOrderItem(newOrderItem);
    const updatedItemInterface = gameData.itemInterface.openItem(newOrderItem);

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedDirectory,
        modifiedItems: updatedModifiedItems,
      },
      itemInterface: updatedItemInterface,
    });
  };

  const deleteOrderItem = (orderItem: IOrderItem) => {
    if (gameData.states.isDayComplete) return;
    const updatedModifiedItems = gameData.git.handleModifyItem(orderItem, true);
    const updatedDirectory =
      gameData.git.workingDirectory.deleteOrderItem(orderItem);
    const updatedItemInterface = gameData.itemInterface.closeItem(orderItem);

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedDirectory,
        modifiedItems: updatedModifiedItems,
      },
      itemInterface: updatedItemInterface,
    });
  };

  const selectOrderItem = (orderItem: IOrderItem) => {
    if (gameData.states.isDayComplete) return;
    const updatedItemInterface = gameData.itemInterface.openItem(orderItem);

    setGameData({
      ...gameData,
      itemInterface: updatedItemInterface,
    });
  };

  return (
    <Directory
      disabled={gameData.states.isDayComplete}
      orders={gameData.orderService.getAvailableOrders()}
      createdItems={gameData.git.workingDirectory.createdItems}
      stagedItems={gameData.git.stagedItems.map((i) => i.item)}
      modifiedItems={gameData.git.modifiedItems.map((i) => i.item)}
      activeItemId={gameData.itemInterface.activeItemId}
      selectOrderItem={selectOrderItem}
      createOrderFolder={createOrderFolder}
      createOrderItem={createOrderItem}
      deleteOrderItem={deleteOrderItem}
    />
  );
};

export default DirectoryController;

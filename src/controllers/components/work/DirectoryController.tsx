import React from "react";

import { IOrder, IOrderItem, Item } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";
import { IngredientType } from "types/enums";
import { v4 } from "uuid";
import { getNewOrderItem, doesOrderItemExist } from "services/gameDataHelper";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const gameData = useGameData();

  const createOrderFolder = (order: IOrder) => {
    const updatedOrders = gameData.directory.orders
      .filter((o) => o.id !== order.id)
      .concat([{ ...order, isCreated: true }]);
    setGameData({
      ...gameData,
      directory: { ...gameData.directory, orders: updatedOrders },
    });
  };

  const createOrderItem = (order: IOrder, name: string) => {
    if (doesOrderItemExist(order, name)) return;

    const newOrderItem: IOrderItem = getNewOrderItem(order, name);
    const updatedModifiedItems = gameData.gitModifiedItems.concat([
      newOrderItem,
    ]);
    const updatedOrders = gameData.directory.orders
      .filter((o) => o.id !== order.id)
      .concat([{ ...order, items: order.items.concat([newOrderItem]) }]);

    setGameData({
      ...gameData,
      gitModifiedItems: updatedModifiedItems,
      directory: { ...gameData.directory, orders: updatedOrders },
    });
  };

  const selectOrderItem = (orderItem: IOrderItem) => {
    if (gameData.selectedItems.map((s) => s.path).includes(orderItem.path))
      return;
    const updatedSelectedFiles = gameData.selectedItems.concat([orderItem]);
    setGameData({ ...gameData, selectedItems: updatedSelectedFiles });
  };

  return (
    <Directory
      directory={gameData.directory}
      stagedItems={gameData.gitStagedItems}
      modifiedItems={gameData.gitModifiedItems}
      selectOrderItem={selectOrderItem}
      createOrderFolder={createOrderFolder}
      createOrderItem={createOrderItem}
    />
  );
};

export default DirectoryController;

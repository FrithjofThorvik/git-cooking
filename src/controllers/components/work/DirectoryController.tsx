import React from "react";

import { IOrder, IOrderItem, Item } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";
import { IngredientType } from "types/enums";
import { v4 } from "uuid";
import {
  getNewOrderItem,
  doesOrderItemExist,
  getOrderFromOrderItem,
  getIndexOfOrder,
} from "services/gameDataHelper";

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

  const deleteOrderItem = (orderItem: IOrderItem) => {
    const order = getOrderFromOrderItem(gameData.directory.orders, orderItem);
    if (!order) return;

    const updatedOrderItems = order.items.filter((i) => i.id !== orderItem.id);
    const orderIndex = getIndexOfOrder(gameData.directory.orders, order);
    let updatedOrders = gameData.directory.orders;
    updatedOrders[orderIndex].items = updatedOrderItems;

    let updatedSelectedItems = gameData.selectedItems;
    if (gameData.selectedItems.includes(orderItem.id)) {
      updatedSelectedItems = updatedSelectedItems.filter(
        (id) => id !== orderItem.id
      );
    }

    setGameData({
      ...gameData,
      directory: { ...gameData.directory, orders: updatedOrders },
      selectedItems: updatedSelectedItems,
    });
  };

  const selectOrderItem = (orderItem: IOrderItem) => {
    if (gameData.selectedItems.includes(orderItem.id)) return;

    setGameData({
      ...gameData,
      selectedItems: [...gameData.selectedItems, orderItem.id],
    });
  };

  return (
    <Directory
      directory={gameData.directory}
      stagedItems={gameData.gitStagedItems}
      modifiedItems={gameData.gitModifiedItems}
      selectOrderItem={selectOrderItem}
      createOrderFolder={createOrderFolder}
      createOrderItem={createOrderItem}
      deleteOrderItem={deleteOrderItem}
    />
  );
};

export default DirectoryController;

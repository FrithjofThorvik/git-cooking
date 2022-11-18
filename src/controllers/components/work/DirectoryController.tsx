import React from "react";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import { useGameData, setGameData } from "hooks/useGameData";
import Directory from "components/work/Directory";
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
    const updatedOrders = gameData.git.workingDirectory.orders
      .filter((o) => o.id !== order.id)
      .concat([{ ...order, isCreated: true }]);
    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: {
          ...gameData.git.workingDirectory,
          orders: updatedOrders,
        },
      },
    });
  };

  const createOrderItem = (order: IOrder, name: string) => {
    if (doesOrderItemExist(order, name)) return;

    const newOrderItem: IOrderItem = getNewOrderItem(order, name);
    const updatedModifiedItems = gameData.git.handleModifyItem(newOrderItem);
    const updatedOrders = gameData.git.workingDirectory.orders
      .filter((o) => o.id !== order.id)
      .concat([{ ...order, items: order.items.concat([newOrderItem]) }]);

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: {
          ...gameData.git.workingDirectory,
          orders: updatedOrders,
        },
        modifiedItems: updatedModifiedItems,
      },
    });
  };

  const deleteOrderItem = (orderItem: IOrderItem) => {
    const order = getOrderFromOrderItem(
      gameData.git.workingDirectory.orders,
      orderItem
    );
    if (!order) return;

    const updatedModifiedItems = gameData.git.handleModifyItem(orderItem, true);
    const updatedOrderItems = order.items.filter(
      (i) => i.path !== orderItem.path
    );
    const orderIndex = getIndexOfOrder(
      gameData.git.workingDirectory.orders,
      order
    );
    let updatedOrders = gameData.git.workingDirectory.orders;
    updatedOrders[orderIndex].items = updatedOrderItems;

    let updatedSelectedItems = gameData.selectedItems;
    if (gameData.selectedItems.includes(orderItem.path)) {
      updatedSelectedItems = updatedSelectedItems.filter(
        (id) => id !== orderItem.path
      );
    }

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: {
          ...gameData.git.workingDirectory,
          orders: updatedOrders,
        },
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

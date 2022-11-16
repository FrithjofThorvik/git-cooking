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
    const updatedModifiedItems = gameData.git.modifiedItems.concat([
      newOrderItem,
    ]);
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

    const updatedOrderItems = order.items.filter((i) => i.id !== orderItem.id);
    const orderIndex = getIndexOfOrder(
      gameData.git.workingDirectory.orders,
      order
    );
    let updatedOrders = gameData.git.workingDirectory.orders;
    updatedOrders[orderIndex].items = updatedOrderItems;

    let updatedSelectedItems = gameData.selectedItems;
    if (gameData.selectedItems.includes(orderItem.id)) {
      updatedSelectedItems = updatedSelectedItems.filter(
        (id) => id !== orderItem.id
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
      },
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
      directory={gameData.git.workingDirectory}
      stagedItems={gameData.git.stagedItems}
      modifiedItems={gameData.git.modifiedItems}
      selectOrderItem={selectOrderItem}
      createOrderFolder={createOrderFolder}
      createOrderItem={createOrderItem}
      deleteOrderItem={deleteOrderItem}
    />
  );
};

export default DirectoryController;

import React from "react";

import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "services/gameDataHelper";
import { IngredientType } from "types/enums";
import { setGameData, useGameData } from "hooks/useGameData";
import { IIngredient, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef } from "services/helpers";
import Item from "components/work/Item";

interface IItemControllerProps {}

const ItemController: React.FC<IItemControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const closeOrderItem = (item: IOrderItem) => {
    if (!gameData.selectedItems.includes(item.path)) return;
    const updatedSelectedFiles = gameData.selectedItems.filter(
      (id) => id !== item.path
    );
    setGameData({ ...gameData, selectedItems: updatedSelectedFiles });
  };

  const handleModifiedItem = (
    orderItem: IOrderItem,
    updatedOrders: IOrder[]
  ) => {
    const newModifiedItems = gameData.git.handleModifyItem(orderItem);

    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: {
          ...gameData.git.workingDirectory,
          orders: updatedOrders,
        },
        modifiedItems: newModifiedItems,
      },
    });
  };

  const setOrderItemType = (orderItem: IOrderItem, type: IngredientType) => {
    const order = getOrderFromOrderItem(
      gameData.git.workingDirectory.orders,
      orderItem
    );
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(
      gameData.git.workingDirectory.orders,
      order
    );
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = copyObjectWithoutRef(
      gameData.git.workingDirectory.orders
    );
    updatedOrders[indexOfOrder].items[indexOfOrderItem].type = type;
    updatedOrders[indexOfOrder].items[indexOfOrderItem].ingredients = [];

    handleModifiedItem(
      updatedOrders[indexOfOrder].items[indexOfOrderItem],
      updatedOrders
    );
  };

  const addIngredientToOrderItem = (
    orderItem: IOrderItem,
    ingredient: IIngredient
  ) => {
    const order = getOrderFromOrderItem(
      gameData.git.workingDirectory.orders,
      orderItem
    );
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(
      gameData.git.workingDirectory.orders,
      order
    );
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = copyObjectWithoutRef(
      gameData.git.workingDirectory.orders
    );
    updatedOrders[indexOfOrder].items[indexOfOrderItem].ingredients.push(
      ingredient
    );

    handleModifiedItem(
      updatedOrders[indexOfOrder].items[indexOfOrderItem],
      updatedOrders
    );
  };

  const removeIngredientFromOrderItem = (
    orderItem: IOrderItem,
    index: number
  ) => {
    const order = getOrderFromOrderItem(
      gameData.git.workingDirectory.orders,
      orderItem
    );
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(
      gameData.git.workingDirectory.orders,
      order
    );
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = copyObjectWithoutRef(
      gameData.git.workingDirectory.orders
    );
    updatedOrders[indexOfOrder].items[indexOfOrderItem].ingredients.splice(
      index,
      1
    );

    handleModifiedItem(
      updatedOrders[indexOfOrder].items[indexOfOrderItem],
      updatedOrders
    );
  };

  return (
    <Item
      selectedItemIds={gameData.selectedItems}
      closeOrderItem={closeOrderItem}
      setOrderItemType={setOrderItemType}
      addIngredientToOrderItem={addIngredientToOrderItem}
      removeIngredientFromOrderItem={removeIngredientFromOrderItem}
      foods={gameData.git.workingDirectory.foods}
      orders={gameData.git.workingDirectory.orders}
    />
  );
};

export default ItemController;

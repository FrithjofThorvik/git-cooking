import React, { useEffect } from "react";

import { IIngredient, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Item from "components/work/Item";
import { IngredientType } from "types/enums";
import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "services/gameDataHelper";
import { gitHelper } from "services/gitHelper";
import { copyObjectWithoutRef, isOrderItem } from "services/helpers";

interface IItemControllerProps {}

const ItemController: React.FC<IItemControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const closeOrderItem = (item: IOrderItem) => {
    if (!gameData.selectedItems.includes(item.id)) return;
    const updatedSelectedFiles = gameData.selectedItems.filter(
      (id) => id !== item.id
    );
    setGameData({ ...gameData, selectedItems: updatedSelectedFiles });
  };

  const handleModifiedItem = (
    orderItem: IOrderItem,
    updatedOrders: IOrder[]
  ) => {
    const isModified = gitHelper.isItemModified(orderItem, gameData.git);

    let newModifiedItems = gameData.git.modifiedItems;

    if (isModified) {
      const indexInModified = newModifiedItems.findIndex((i) => {
        if (isOrderItem(i)) return i.id === orderItem.id;
      });
      if (indexInModified === -1) {
        newModifiedItems = gameData.git.modifiedItems.concat([orderItem]);
      } else {
        newModifiedItems[indexInModified] = orderItem;
      }
    } else {
      newModifiedItems = newModifiedItems.filter((i) => {
        if (isOrderItem(i)) return i.id != orderItem.id;
      });
    }

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

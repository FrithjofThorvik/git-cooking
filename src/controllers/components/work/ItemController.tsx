import React, { useEffect } from "react";

import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Item from "components/work/Item";
import { IngredientType } from "types/enums";
import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "services/gameDataHelper";

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

  const modifyOrderItem = (orderItem: IOrderItem) => {
    let isValid = true;
    for (let i = 0; i < gameData.gitModifiedItems.length; i++) {
      if (gameData.gitModifiedItems[i].path === orderItem.path) isValid = false;
    }
    if (!isValid) {
      alert("Item already modified");
      return;
    }
    const newModifiedItems = gameData.gitModifiedItems.concat([orderItem]);
    setGameData({ ...gameData, gitModifiedItems: newModifiedItems });
  };

  const setOrderItemType = (orderItem: IOrderItem, type: IngredientType) => {
    const order = getOrderFromOrderItem(gameData.directory.orders, orderItem);
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(gameData.directory.orders, order);
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = gameData.directory.orders;
    updatedOrders[indexOfOrder].items[indexOfOrderItem].type = type;

    setGameData({
      ...gameData,
      directory: { ...gameData.directory, orders: updatedOrders },
    });
  };

  const addIngredientToOrderItem = (
    orderItem: IOrderItem,
    ingredient: IIngredient
  ) => {
    const order = getOrderFromOrderItem(gameData.directory.orders, orderItem);
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(gameData.directory.orders, order);
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = gameData.directory.orders;
    updatedOrders[indexOfOrder].items[indexOfOrderItem].ingredients.push(
      ingredient
    );

    setGameData({
      ...gameData,
      directory: { ...gameData.directory, orders: updatedOrders },
    });
  };

  const removeIngredientFromOrderItem = (
    orderItem: IOrderItem,
    index: number
  ) => {
    const order = getOrderFromOrderItem(gameData.directory.orders, orderItem);
    if (!order) return;

    const indexOfOrder = getIndexOfOrder(gameData.directory.orders, order);
    const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

    let updatedOrders = gameData.directory.orders;
    updatedOrders[indexOfOrder].items[indexOfOrderItem].ingredients.splice(
      index,
      1
    );

    setGameData({
      ...gameData,
      directory: { ...gameData.directory, orders: updatedOrders },
    });
  };

  useEffect(() => {
    console.log(gameData.directory.orders);
  }, [gameData.directory.orders]);

  return (
    <Item
      selectedItemIds={gameData.selectedItems}
      closeOrderItem={closeOrderItem}
      modifyOrderItem={modifyOrderItem}
      setOrderItemType={setOrderItemType}
      addIngredientToOrderItem={addIngredientToOrderItem}
      removeIngredientFromOrderItem={removeIngredientFromOrderItem}
      foods={gameData.directory.foods}
      orders={gameData.directory.orders}
    />
  );
};

export default ItemController;

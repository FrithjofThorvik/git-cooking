import React from "react";

import { IModifiedItem } from "types/gitInterfaces";
import { IngredientType } from "types/enums";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
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

  const modifyOrderItem = (
    orderItem: IOrderItem,
    data: {
      type?: IngredientType;
      addIngredient?: IIngredient;
      removeIngredientAtIndex?: number;
    }
  ) => {
    let updatedModifiedItems: IModifiedItem[] = gameData.git.modifiedItems;
    const updatedOrders = gameData.git.workingDirectory.modifyOrderItem(
      orderItem,
      data,
      (o) => (updatedModifiedItems = gameData.git.handleModifyItem(o))
    );
    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: updatedOrders,
        modifiedItems: updatedModifiedItems,
      },
    });
  };

  return (
    <Item
      selectedItemIds={gameData.selectedItems}
      closeOrderItem={closeOrderItem}
      modifyOrderItem={modifyOrderItem}
      foods={gameData.store.foods}
      orders={gameData.git.workingDirectory.orders}
    />
  );
};

export default ItemController;

import React from "react";

import { IModifiedItem } from "types/gitInterfaces";
import { IngredientType } from "types/enums";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Item from "components/work/Item";

interface IItemControllerProps {}

const ItemController: React.FC<IItemControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const closeOrderItem = (orderItem: IOrderItem) => {
    const updatedItemInterface = gameData.itemInterface.closeItem(orderItem);
    setGameData({ ...gameData, itemInterface: updatedItemInterface });
  };

  const openOrderItem = (orderItem: IOrderItem) => {
    const updatedItemInterface = gameData.itemInterface.openItem(orderItem);
    setGameData({ ...gameData, itemInterface: updatedItemInterface });
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
      foods={gameData.store.foods}
      orders={gameData.orderService.orders}
      activeItemId={gameData.itemInterface.activeItemId}
      selectedItemIds={gameData.itemInterface.selectedItemIds}
      createdItems={gameData.git.workingDirectory.createdItems}
      openOrderItem={openOrderItem}
      closeOrderItem={closeOrderItem}
      modifyOrderItem={modifyOrderItem}
    />
  );
};

export default ItemController;

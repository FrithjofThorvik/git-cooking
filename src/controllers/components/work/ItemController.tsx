import React, { useEffect } from "react";

import { IModifiedItem } from "types/gitInterfaces";
import { IngredientType } from "types/enums";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Item from "components/work/Item";

interface IItemControllerProps {}

const ItemController: React.FC<IItemControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const closeOrderItem = (orderItem: IOrderItem) => {
    if (gameData.states.isDayComplete) return;
    const updatedItemInterface = gameData.itemInterface.closeItem(orderItem);
    setGameData({ ...gameData, itemInterface: updatedItemInterface });
  };

  const openOrderItem = (orderItem: IOrderItem) => {
    if (gameData.states.isDayComplete) return;
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
    if (gameData.states.isDayComplete) return;
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

  // Close all opened files if day is completed
  useEffect(() => {
    if (gameData.states.isDayComplete) {
      if (gameData.itemInterface.selectedItemIds.length > 0) {
        setGameData({
          ...gameData,
          itemInterface: {
            ...gameData.itemInterface,
            selectedItemIds: [],
            activeItemId: "",
          },
        });
      }
    }
  }, [gameData.states.isDayComplete]);

  return (
    <Item
      foods={gameData.store.foods}
      disabled={gameData.states.isDayComplete}
      activeItemId={gameData.itemInterface.activeItemId}
      orders={gameData.orderService.getAvailableOrders()}
      selectedItemIds={gameData.itemInterface.selectedItemIds}
      createdItems={gameData.git.workingDirectory.createdItems}
      openOrderItem={openOrderItem}
      closeOrderItem={closeOrderItem}
      modifyOrderItem={modifyOrderItem}
    />
  );
};

export default ItemController;

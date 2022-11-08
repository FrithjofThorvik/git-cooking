import React from "react";

import { IOrderItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import Item from "components/work/Item";

interface IItemControllerProps {}

const ItemController: React.FC<IItemControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const closeOrderItem = (item: IOrderItem) => {
    if (!gameData.selectedItems.map((s) => s.path).includes(item.path)) return;
    const updatedSelectedFiles = gameData.selectedItems.filter(
      (p) => p.path !== item.path
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

  return (
    <Item
      selectedItems={gameData.selectedItems}
      closeOrderItem={closeOrderItem}
      modifyOrderItem={modifyOrderItem}
    />
  );
};

export default ItemController;

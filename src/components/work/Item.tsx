import React, { useEffect, useState } from "react";

import { IngredientType } from "types/enums";
import {
  getOrderItemFromPath,
  getOrderItemsFromPaths,
} from "services/gameDataHelper";
import {
  IFood,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import ItemSelector from "./item/ItemSelector";
import ItemInterface from "./item/ItemInterface";

import "./Item.scss";

interface IItemProps {
  foods: IFood[];
  orders: IOrder[];
  selectedItemIds: string[];
  closeOrderItem: (item: IOrderItem) => void;
  addIngredientToOrderItem: (
    orderItem: IOrderItem,
    ingredient: IIngredient
  ) => void;
  removeIngredientFromOrderItem: (orderItem: IOrderItem, index: number) => void;
  setOrderItemType: (orderItem: IOrderItem, type: IngredientType) => void;
}

const Item: React.FC<IItemProps> = ({
  foods,
  orders,
  selectedItemIds,
  closeOrderItem,
  addIngredientToOrderItem,
  removeIngredientFromOrderItem,
  setOrderItemType,
}): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>(
    getOrderItemsFromPaths(orders, selectedItemIds)
  );
  const [activeItem, setActiveItem] = useState<IOrderItem | null>(
    selectedItems[0] ?? null
  );

  useEffect(() => {
    let tempActiveItemIndex = selectedItems.findIndex(
      (i) => i.path === activeItem?.path
    );
    if (tempActiveItemIndex === -1) {
      setActiveItem(null);
    } else if (selectedItems.length > 0)
      setActiveItem(selectedItems[tempActiveItemIndex]);
  }, [orders, selectedItems]);

  useEffect(() => {
    const oldSelectedItemIds = selectedItems.map((i) => i.path);

    for (let i = 0; i < selectedItemIds.length; i++) {
      if (!oldSelectedItemIds.includes(selectedItemIds[i])) {
        const newActiveItem = getOrderItemFromPath(orders, selectedItemIds[i]);
        if (newActiveItem) setActiveItem(newActiveItem);
      }
    }

    setSelectedItems(getOrderItemsFromPaths(orders, selectedItemIds));
  }, [selectedItemIds, JSON.stringify(orders)]);

  return (
    <div className="item">
      <ItemSelector
        orders={orders}
        items={selectedItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        closeOrderItem={closeOrderItem}
      />
      <ItemInterface
        activeItem={activeItem}
        setOrderItemType={setOrderItemType}
        addIngredientToOrderItem={addIngredientToOrderItem}
        removeIngredientFromOrderItem={removeIngredientFromOrderItem}
        foods={foods}
      />
    </div>
  );
};

export default Item;

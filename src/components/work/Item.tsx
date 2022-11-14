import React, { useEffect, useState } from "react";

import { IngredientType } from "types/enums";
import {
  getOrderItemFromId,
  getOrderItemsFromIds,
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
  modifyOrderItem: (item: IOrderItem) => void;
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
  modifyOrderItem,
  addIngredientToOrderItem,
  removeIngredientFromOrderItem,
  setOrderItemType,
}): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>(
    getOrderItemsFromIds(orders, selectedItemIds)
  );
  const [activeItem, setActiveItem] = useState<IOrderItem | null>(
    selectedItems[0] ?? null
  );

  useEffect(() => {
    let tempActiveItem = activeItem;
    if (selectedItems.filter((i) => i.id === activeItem?.id).length === 0) {
      tempActiveItem = null;
      setActiveItem(null);
    }
    if (tempActiveItem === null && selectedItems.length > 0)
      setActiveItem(selectedItems[0]);
  }, [selectedItems]);

  useEffect(() => {
    const oldSelectedItemIds = selectedItems.map((i) => i.id);

    for (let i = 0; i < selectedItemIds.length; i++) {
      if (!oldSelectedItemIds.includes(selectedItemIds[i])) {
        const newActiveItem = getOrderItemFromId(orders, selectedItemIds[i]);
        if (newActiveItem) setActiveItem(newActiveItem);
      }
    }

    setSelectedItems(getOrderItemsFromIds(orders, selectedItemIds));
  }, [selectedItemIds]);

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
        modifyOrderItem={modifyOrderItem}
        setOrderItemType={setOrderItemType}
        addIngredientToOrderItem={addIngredientToOrderItem}
        removeIngredientFromOrderItem={removeIngredientFromOrderItem}
        foods={foods}
      />
    </div>
  );
};

export default Item;

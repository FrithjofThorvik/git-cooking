import React, { useEffect, useState } from "react";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import { IFood } from "types/foodInterfaces";
import { IngredientType } from "types/enums";
import { getOrderItemsFromPaths } from "services/gameDataHelper";
import { IIngredient, IOrder, IOrderItem } from "types/gameDataInterfaces";
import ItemSelector from "./item/ItemSelector";
import ItemInterface from "./item/ItemInterface";

import "./Item.scss";

interface IItemProps {
  foods: IFood[];
  orders: IOrder[];
  disabled: boolean;
  createdItems: IOrderItem[];
  activeItemId: string;
  selectedItemIds: string[];
  openOrderItem: (orderItem: IOrderItem) => void;
  closeOrderItem: (orderItem: IOrderItem) => void;
  modifyOrderItem: (
    orderItem: IOrderItem,
    data: {
      type?: IngredientType;
      addIngredient?: IIngredient;
      removeIngredientAtIndex?: number;
    }
  ) => void;
}

const Item: React.FC<IItemProps> = ({
  foods,
  orders,
  disabled,
  createdItems,
  activeItemId,
  openOrderItem,
  closeOrderItem,
  modifyOrderItem,
  selectedItemIds,
}): JSX.Element => {
  const [selectedItems, setSelectedItems] = useState<IOrderItem[]>(
    getOrderItemsFromPaths(createdItems, selectedItemIds)
  );
  const [activeItem, setActiveItem] = useState<IOrderItem | null>(
    selectedItems[0] ?? null
  );

  // Update active item
  useEffect(() => {
    let tempActiveItemIndex = selectedItems.findIndex(
      (i) => i.path === activeItemId
    );
    if (tempActiveItemIndex === -1) {
      setActiveItem(null);
    } else if (selectedItems.length > 0)
      setActiveItem(selectedItems[tempActiveItemIndex]);
  }, [selectedItems, activeItemId]);

  useEffect(() => {
    setSelectedItems(getOrderItemsFromPaths(createdItems, selectedItemIds));
  }, [selectedItemIds, JSON.stringify(createdItems)]);

  return (
    <div className="item">
      {disabled ? (
        <div className="item-empty disabled">
          <VerifiedTwoToneIcon />
          <p>Day completed!</p>
          <p>Finish up and push your work before you leave...</p>
        </div>
      ) : selectedItemIds.length === 0 ? (
        <div className="item-empty">
          <FastfoodOutlinedIcon />
          <p>No selected items...</p>
        </div>
      ) : (
        <>
          <ItemSelector
            orders={orders}
            items={selectedItems}
            activeItem={activeItem}
            openOrderItem={openOrderItem}
            closeOrderItem={closeOrderItem}
          />
          <ItemInterface
            activeItem={activeItem}
            modifyOrderItem={modifyOrderItem}
            foods={foods}
          />
        </>
      )}
    </div>
  );
};

export default Item;

import React, { useEffect, useState } from "react";

import { IOrderItem } from "types/gameDataInterfaces";
import ItemSelector from "./item/ItemSelector";
import ItemInterface from "./item/ItemInterface";

import "./Item.scss";

interface IItemProps {
  selectedItems: IOrderItem[];
  closeOrderItem: (item: IOrderItem) => void;
  modifyOrderItem: (item: IOrderItem) => void;
}

const Item: React.FC<IItemProps> = ({
  selectedItems,
  closeOrderItem,
  modifyOrderItem,
}): JSX.Element => {
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

  return (
    <div className="item">
      <ItemSelector
        items={selectedItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        closeOrderItem={closeOrderItem}
      />
      <ItemInterface
        activeItem={activeItem}
        modifyOrderItem={modifyOrderItem}
      />
    </div>
  );
};

export default Item;

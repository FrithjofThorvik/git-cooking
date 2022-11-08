import React from "react";
import CloseIcon from "@mui/icons-material/Close";

import { IOrderItem } from "types/gameDataInterfaces";

import "./ItemSelector.scss";

interface IItemSelectorProps {
  items: IOrderItem[];
  activeItem: IOrderItem | null;
  setActiveItem: React.Dispatch<React.SetStateAction<IOrderItem | null>>;
  closeOrderItem: (item: IOrderItem) => void;
}

const ItemSelector: React.FC<IItemSelectorProps> = ({
  items,
  activeItem,
  setActiveItem,
  closeOrderItem,
}): JSX.Element => {
  return (
    <div className="item-selector">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item-selector-item ${
            activeItem?.id === item.id && "item-selector-item-selected"
          }`}
          onClick={() => setActiveItem(item)}
        >
          {item.name}
          <CloseIcon
            className="item-selector-item-icon"
            onClick={() => closeOrderItem(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default ItemSelector;

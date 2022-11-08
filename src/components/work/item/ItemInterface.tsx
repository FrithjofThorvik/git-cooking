import React from "react";

import { IOrderItem } from "types/gameDataInterfaces";

import "./ItemInterface.scss";

interface IItemInterfaceProps {
  activeItem: IOrderItem | null;
  modifyOrderItem: (item: IOrderItem) => void;
}

const ItemInterface: React.FC<IItemInterfaceProps> = ({
  activeItem,
  modifyOrderItem,
}): JSX.Element => {
  if (activeItem === null) return <></>;
  return (
    <div className="item-interface">
      <h1>{activeItem.name}</h1>
      <button onClick={() => modifyOrderItem(activeItem)}>Modify</button>
    </div>
  );
};

export default ItemInterface;

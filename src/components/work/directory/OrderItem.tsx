import React, { useEffect, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { isOrderItem } from "services/helpers";
import { IOrderItem, Item } from "types/gameDataInterfaces";

import "./OrderItem.scss";

interface IOrderItemProps {
  item: IOrderItem;
  stagedItems: Item[];
  modifiedItems: Item[];
  selectOrderItem: (order: IOrderItem) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const OrderItem: React.FC<IOrderItemProps> = ({
  item,
  stagedItems,
  modifiedItems,
  selectOrderItem,
  deleteOrderItem,
}): JSX.Element => {
  const [isStaged, setIsStaged] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  useEffect(() => {
    let newIsStaged = false;
    let newIsModified = false;

    for (let i = 0; i < stagedItems.length; i++) {
      if (stagedItems[i].path === item.path) newIsStaged = true;
    }
    for (let i = 0; i < modifiedItems.length; i++) {
      if (modifiedItems[i].path === item.path) newIsModified = true;
    }

    setIsModified(newIsModified);
    setIsStaged(newIsStaged);
  }, [stagedItems, modifiedItems]);

  return (
    <div
      className="order-item"
      style={{
        color: `${isModified ? "orange" : isStaged ? "green" : "white"}`,
      }}
      onClick={() => {
        if (isOrderItem(item)) selectOrderItem(item);
      }}
    >
      <DescriptionOutlinedIcon className="order-item-icon" />
      <div>{item.name}</div>
      <DeleteOutlineOutlinedIcon
        onClick={() => deleteOrderItem(item)}
        className="order-item-icon-delete"
      />
    </div>
  );
};

export default OrderItem;

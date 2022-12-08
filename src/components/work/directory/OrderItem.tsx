import React, { useEffect, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { IOrderItem } from "types/gameDataInterfaces";

import "./OrderItem.scss";

interface IOrderItemProps {
  active: boolean;
  item: IOrderItem;
  disabled: boolean;
  stagedItems: IOrderItem[];
  modifiedItems: IOrderItem[];
  selectOrderItem: (order: IOrderItem) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const OrderItem: React.FC<IOrderItemProps> = ({
  item,
  active,
  disabled,
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

  const handleDelete = (e: React.MouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation();
    deleteOrderItem(item);
  };

  return (
    <div
      className={`order-item ${active ? "active" : ""}  ${
        isModified ? "modified" : isStaged ? "staged" : ""
      }`}
      onClick={() => selectOrderItem(item)}
      style={{ pointerEvents: `${disabled ? "none" : "auto"}` }}
    >
      <DescriptionOutlinedIcon className="order-item-icon" />
      <div>{item.name}</div>
      <DeleteOutlineOutlinedIcon
        onClick={(e) => handleDelete(e)}
        className="order-item-icon-delete"
      />
    </div>
  );
};

export default OrderItem;

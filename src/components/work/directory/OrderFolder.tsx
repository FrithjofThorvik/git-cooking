import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import Input from "./Input";
import Button from "./Button";
import OrderItem from "./OrderItem";

import "./OrderFolder.scss";

interface IOrderFolderProps {
  order: IOrder;
  createdItems: IOrderItem[];
  stagedItems: IOrderItem[];
  modifiedItems: IOrderItem[];
  activeItemId: string;
  selectOrderItem: (order: IOrderItem) => void;
  createOrderItem: (order: IOrder, name: string) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const OrderFolder: React.FC<IOrderFolderProps> = ({
  order,
  createdItems,
  stagedItems,
  modifiedItems,
  activeItemId,
  selectOrderItem,
  createOrderItem,
  deleteOrderItem,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCreatingItem, setIsCreatingItem] = useState<boolean>(false);

  return (
    <div className="order-folder">
      <div className="order-folder-info" onClick={() => setIsOpen(!isOpen)}>
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{order.name}</div>
      </div>
      {isOpen && (
        <div className="order-folder-container">
          {createdItems
            .filter((item) => item.orderId === order.id)
            .map((item, i) => {
              return (
                <OrderItem
                  key={i}
                  item={item}
                  stagedItems={stagedItems}
                  modifiedItems={modifiedItems}
                  selectOrderItem={selectOrderItem}
                  deleteOrderItem={deleteOrderItem}
                  active={item.path === activeItemId}
                />
              );
            })}
          {isCreatingItem ? (
            <Input
              order={order}
              createdItems={createdItems}
              createOrderItem={createOrderItem}
              hideInput={() => setIsCreatingItem(false)}
            />
          ) : (
            <Button text={"Add item"} onClick={() => setIsCreatingItem(true)} />
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFolder;

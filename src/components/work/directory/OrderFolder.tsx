import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import OrderItem from "./OrderItem";

import "./OrderFolder.scss";
import Button from "./Button";
import Input from "./Input";

interface IOrderFolderProps {
  order: IOrder;
  stagedItems: IOrderItem[];
  modifiedItems: IOrderItem[];
  selectOrderItem: (order: IOrderItem) => void;
  createOrderItem: (order: IOrder, name: string) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const OrderFolder: React.FC<IOrderFolderProps> = ({
  order,
  stagedItems,
  modifiedItems,
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
          {order.items
            .sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            )
            .map((item, i) => {
              return (
                <OrderItem
                  key={i}
                  item={item}
                  stagedItems={stagedItems}
                  modifiedItems={modifiedItems}
                  selectOrderItem={selectOrderItem}
                  deleteOrderItem={deleteOrderItem}
                />
              );
            })}
          {isCreatingItem ? (
            <Input
              order={order}
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

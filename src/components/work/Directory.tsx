import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import Button from "./directory/Button";
import OrdersFolder from "./directory/OrderFolder";

import "./Directory.scss";

interface IDirectoryProps {
  orders: IOrder[];
  disabled: boolean;
  createdItems: IOrderItem[];
  stagedItems: IOrderItem[];
  modifiedItems: IOrderItem[];
  activeItemId: string;
  selectOrderItem: (orderItem: IOrderItem) => void;
  createOrderFolder: (order: IOrder) => void;
  createOrderItem: (order: IOrder, name: string) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const Directory: React.FC<IDirectoryProps> = ({
  orders,
  disabled,
  createdItems,
  stagedItems,
  modifiedItems,
  activeItemId,
  selectOrderItem,
  createOrderFolder,
  createOrderItem,
  deleteOrderItem,
}): JSX.Element => {
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(true);

  return (
    <div className="directory">
      <div className="directory-content">
        <div className="directory-content-folder">
          <div
            className="directory-content-folder-info"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
          >
            <ChevronRightIcon
              style={{
                transform: `rotate(${isOrdersOpen ? "90deg" : "0deg"})`,
              }}
            />
            <div>orders</div>
          </div>
          {isOrdersOpen && (
            <div className="directory-content-folder-content">
              {orders
                .filter((o) => o.isCreated)
                .map((order: IOrder) => (
                  <OrdersFolder
                    order={order}
                    createdItems={createdItems}
                    stagedItems={stagedItems}
                    modifiedItems={modifiedItems}
                    key={order.id}
                    disabled={disabled}
                    activeItemId={activeItemId}
                    selectOrderItem={selectOrderItem}
                    createOrderItem={createOrderItem}
                    deleteOrderItem={deleteOrderItem}
                  />
                ))}
              {orders
                .filter((o) => !o.isCreated)
                .map((order: IOrder) => (
                  <Button
                    disabled={disabled}
                    text={order.name}
                    onClick={() => createOrderFolder(order)}
                    key={order.id}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;

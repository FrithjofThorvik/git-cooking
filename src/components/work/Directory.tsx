import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IDirectory, IOrder, IOrderItem } from "types/gameDataInterfaces";
import Button from "./directory/Button";
import OrdersFolder from "./directory/OrderFolder";

import "./Directory.scss";

interface IDirectoryProps {
  directory: IDirectory;
  stagedItems: IOrderItem[];
  modifiedItems: IOrderItem[];
  activeItemId: string;
  selectOrderItem: (orderItem: IOrderItem) => void;
  createOrderFolder: (order: IOrder) => void;
  createOrderItem: (order: IOrder, name: string) => void;
  deleteOrderItem: (orderItem: IOrderItem) => void;
}

const Directory: React.FC<IDirectoryProps> = ({
  directory,
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
            <div>Orders</div>
          </div>
          {isOrdersOpen && (
            <div className="directory-content-folder-content">
              {directory.orders
                .filter((o) => o.isCreated)
                .map((order: IOrder) => (
                  <OrdersFolder
                    order={order}
                    stagedItems={stagedItems}
                    modifiedItems={modifiedItems}
                    key={order.id}
                    activeItemId={activeItemId}
                    selectOrderItem={selectOrderItem}
                    createOrderItem={createOrderItem}
                    deleteOrderItem={deleteOrderItem}
                  />
                ))}
              {directory.orders
                .filter((o) => !o.isCreated)
                .map((order: IOrder) => (
                  <Button
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

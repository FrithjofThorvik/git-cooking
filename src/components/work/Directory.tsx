import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  IDirectory,
  IFood,
  IOrder,
  IOrderItem,
  Item,
} from "types/gameDataInterfaces";
import Button from "./directory/Button";
import FoodsFolder from "./directory/FoodFolder";
import OrdersFolder from "./directory/OrderFolder";

import "./Directory.scss";

interface IDirectoryProps {
  directory: IDirectory;
  stagedItems: Item[];
  modifiedItems: Item[];
  selectOrderItem: (orderItem: IOrderItem) => void;
  createOrderFolder: (order: IOrder) => void;
  createOrderItem: (order: IOrder, name: string) => void;
}

const Directory: React.FC<IDirectoryProps> = ({
  directory,
  stagedItems,
  modifiedItems,
  selectOrderItem,
  createOrderFolder,
  createOrderItem,
}): JSX.Element => {
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(true);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState<boolean>(true);

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
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((order: IOrder) => (
                  <OrdersFolder
                    order={order}
                    stagedItems={stagedItems}
                    modifiedItems={modifiedItems}
                    key={order.id}
                    selectOrderItem={selectOrderItem}
                    createOrderItem={createOrderItem}
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
        <div className="directory-content-folder">
          <div
            className="directory-content-folder-info"
            onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
          >
            <ChevronRightIcon
              style={{
                transform: `rotate(${isIngredientsOpen ? "90deg" : "0deg"})`,
              }}
            />
            <div>Ingredients</div>
          </div>
          {isIngredientsOpen && (
            <div className="directory-content-folder-content">
              {directory.foods.map((food: IFood) => (
                <FoodsFolder
                  food={food}
                  stagedItems={stagedItems}
                  modifiedItems={modifiedItems}
                  key={food.id}
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

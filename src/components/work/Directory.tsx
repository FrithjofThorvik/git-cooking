import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  IDirectory,
  IFood,
  IOrder,
  IOrderItem,
  Item,
} from "types/gameDataInterfaces";
import DirectoryFolder from "./directory/DirectoryFolder";

import "./Directory.scss";

interface IDirectoryProps {
  directory: IDirectory;
  stagedItems: Item[];
  modifiedItems: Item[];
  modifyOrderItem: (order: IOrderItem) => void;
}

const Directory: React.FC<IDirectoryProps> = ({
  directory,
  stagedItems,
  modifiedItems,
  modifyOrderItem,
}): JSX.Element => {
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState<boolean>(false);

  return (
    <div className="directory">
      <div className="directory-content">
        <div className="directory-content-orders">
          <div
            className="directory-content-info"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
          >
            <ChevronRightIcon
              style={{
                transform: `rotate(${isOrdersOpen ? "90deg" : "0deg"})`,
              }}
            />
            <div>Orders</div>
          </div>
          {isOrdersOpen &&
            directory.orders.map((order: IOrder) => (
              <DirectoryFolder
                folder={order}
                stagedItems={stagedItems}
                modifiedItems={modifiedItems}
                key={order.id}
                modifyOrderItem={modifyOrderItem}
              />
            ))}
        </div>
        <div className="directory-content-ingredients">
          <div
            className="directory-content-info"
            onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
          >
            <ChevronRightIcon
              style={{
                transform: `rotate(${isIngredientsOpen ? "90deg" : "0deg"})`,
              }}
            />
            <div>Ingredients</div>
          </div>
          {isIngredientsOpen &&
            directory.foods.map((food: IFood) => (
              <DirectoryFolder
                folder={food}
                stagedItems={stagedItems}
                modifiedItems={modifiedItems}
                key={food.id}
                modifyOrderItem={modifyOrderItem}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Directory;

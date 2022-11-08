import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IFood, Item } from "types/gameDataInterfaces";
import IngredientItem from "./IngredientItem";

import "./FoodFolder.scss";

interface IFoodFolderProps {
  food: IFood;
  stagedItems: Item[];
  modifiedItems: Item[];
}

const FoodFolder: React.FC<IFoodFolderProps> = ({
  food,
  stagedItems,
  modifiedItems,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="food-folder">
      <div
        className="food-folder-info"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{food.name}</div>
      </div>
      {isOpen && (
        <div className="food-folder-container">
          {food.items.map((item, i) => {
            return (
              <IngredientItem
                item={item}
                stagedItems={stagedItems}
                modifiedItems={modifiedItems}
                key={i}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodFolder;

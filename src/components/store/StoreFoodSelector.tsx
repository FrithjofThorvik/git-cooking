import { Tooltip } from "@mui/material";
import React from "react";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

import { IngredientType } from "types/enums";
import { INewUnlockedItems } from "types/interfaces";

import "./StoreFoodSelector.scss";

interface IStoreFoodSelectorProps {
  activeType: IngredientType;
  fixed?: boolean;
  showName?: boolean;
  newUnlockedItems?: INewUnlockedItems;
  setType: (type: IngredientType) => void;
}

const StoreFoodSelector: React.FC<IStoreFoodSelectorProps> = ({
  activeType,
  fixed,
  showName = true,
  newUnlockedItems,
  setType,
}): JSX.Element => {
  const iconSwitch = (type: IngredientType) => {
    switch (type) {
      case IngredientType.BURGER:
        return <LunchDiningIcon />;
      case IngredientType.EXTRA:
        return <RestaurantOutlinedIcon />;
      default:
        return <QuestionMarkIcon />;
    }
  };

  const newUnlockedItemsCount = (ingredientType: IngredientType) => {
    if (newUnlockedItems === undefined) return 0;
    switch (ingredientType) {
      case IngredientType.BURGER:
        return newUnlockedItems.ingredients.burger;
      case IngredientType.EXTRA:
        return newUnlockedItems.ingredients.extra;
      default:
        return 0;
    }
  };

  return (
    <div
      className="store-food-selector"
      style={{
        position: fixed ? "absolute" : "static",
        top: fixed ? "-20px" : "",
      }}
    >
      <div className="store-food-selector-content">
        {Object.values(IngredientType).map((type) => {
          return (
            <Tooltip title={type} key={type} placement="top" arrow>
              <div
                className={`store-food-selector-content-item ${
                  type === activeType && "selected"
                }`}
                key={type}
                onClick={() => setType(type)}
              >
                {iconSwitch(type)}
                {newUnlockedItemsCount(type) > 0 && (
                  <div className="store-food-selector-content-item-new">
                    {newUnlockedItemsCount(type)}
                  </div>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
      {showName && <div className="store-food-selector-name">{activeType}</div>}
    </div>
  );
};

export default StoreFoodSelector;

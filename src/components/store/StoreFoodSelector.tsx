import React from "react";
import { Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import { IngredientType } from "types/enums";

import "./StoreFoodSelector.scss";

interface IStoreFoodSelectorProps {
  activeType: IngredientType;
  setType: (type: IngredientType) => void;
}

const StoreFoodSelector: React.FC<IStoreFoodSelectorProps> = ({
  activeType,
  setType,
}): JSX.Element => {
  const iconSwitch = (type: IngredientType) => {
    switch (type) {
      case IngredientType.BURGER:
        return <LunchDiningIcon />;
      case IngredientType.EXTRA:
        return <AddIcon />;
      case IngredientType.DRINKS:
        return <LocalDrinkIcon />;
      default:
        return <QuestionMarkIcon />;
    }
  };

  return (
    <div className="store-food-selector">
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
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div className="store-food-selector-name">{activeType}</div>
    </div>
  );
};

export default StoreFoodSelector;

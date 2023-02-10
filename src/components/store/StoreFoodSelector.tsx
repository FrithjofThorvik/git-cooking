import React from "react";
import { Tooltip } from "@mui/material";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

import { IngredientType } from "types/enums";

import "./StoreFoodSelector.scss";

interface IStoreFoodSelectorProps {
  activeType: IngredientType;
  fixed?: boolean;
  setType: (type: IngredientType) => void;
}

const StoreFoodSelector: React.FC<IStoreFoodSelectorProps> = ({
  activeType,
  fixed,
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

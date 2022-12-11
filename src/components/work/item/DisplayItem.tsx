import React from "react";
import { ThemeProvider, Tooltip } from "@mui/material";

import { theme } from "styles/muiThemes";
import { IOrderItem } from "types/gameDataInterfaces";

import "./DisplayItem.scss";

interface DisplayItemProps {
  item: IOrderItem;
  removeIngredient?: (index: number) => void;
}

const DisplayItem: React.FC<DisplayItemProps> = ({
  item,
  removeIngredient,
}) => {
  return (
    <div className="item-display">
      <ThemeProvider theme={theme}>
        <Tooltip
          title={item.name}
          placement="bottom"
          disableHoverListener={removeIngredient ? true : false}
          disableInteractive
        >
          <div className="item-display-img">
            {item.ingredients.map((ing, index) => (
              <Tooltip
                key={index}
                title={ing.name}
                placement="right"
                arrow
                disableInteractive
              >
                <img
                  src={ing.image}
                  className={`${
                    removeIngredient ? "item-display-img-remove" : ""
                  }`}
                  onClick={() => removeIngredient && removeIngredient(index)}
                />
              </Tooltip>
            ))}
          </div>
        </Tooltip>
      </ThemeProvider>
    </div>
  );
};

export default DisplayItem;

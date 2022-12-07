import React from "react";

import { IOrderItem } from "types/gameDataInterfaces";
import { ThemeProvider, Tooltip } from "@mui/material";

import "./DisplayItem.scss";
import {theme} from "styles/muiThemes";

interface DisplayItemProps {
  item: IOrderItem;
}

const DisplayItem: React.FC<DisplayItemProps> = ({ item }) => {
  return (
    <div className="item-display">
      <ThemeProvider theme={theme}>
        <Tooltip title={item.name} placement="bottom" disableInteractive>
          <div className="item-display-img">
            {item.ingredients.map((ing, index) => (
              <Tooltip
                key={index}
                title={ing.name}
                placement="right"
                arrow
                disableInteractive
              >
                <img src={ing.image} />
              </Tooltip>
            ))}
          </div>
        </Tooltip>
      </ThemeProvider>
    </div>
  );
};

export default DisplayItem;

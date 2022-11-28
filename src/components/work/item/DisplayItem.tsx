import React from "react";

import { IOrderItem } from "types/gameDataInterfaces";
import { ThemeProvider, Tooltip, createTheme } from "@mui/material";

import "./DisplayItem.scss";

interface DisplayItemProps {
  item: IOrderItem;
}

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2b2b2b",
          color: "#e2e8f0",
        },
        arrow: {
          color: "#2b2b2b",
        },
      },
    },
  },
});

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

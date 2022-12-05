import React from "react";
import { ThemeProvider, Tooltip, createTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import "./HelpButton.scss";

interface IHelpButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HelpButton: React.FC<IHelpButtonProps> = ({
  isOpen,
  onClick,
}): JSX.Element => {
  return (
    <div className="help-button" onClick={() => onClick()}>
      <ThemeProvider theme={theme}>
        <Tooltip title={isOpen ? "Close" : "Help"}>
          {isOpen ? <CloseIcon /> : <MenuBookIcon />}
        </Tooltip>
      </ThemeProvider>
    </div>
  );
};

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2b2b2b",
          color: "#e2e8f0",
        },
      },
    },
  },
});

export default HelpButton;

import { createTheme } from "@mui/material";

export const theme = createTheme({
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

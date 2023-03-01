import CloseIcon from "@mui/icons-material/Close";
import HighlightText from "components/HighlightText";

import { useEffect, useState } from "react";
import { IGitCommand } from "types/gameDataInterfaces";
import { useKeyPress } from "hooks/useKeyPress";
import { ThemeProvider, Tooltip, createTheme } from "@mui/material";

import "./CommandPopup.scss";

interface ICommandPopup {
  purchasedGitCommand: IGitCommand;
}

const CommandPopup: React.FC<ICommandPopup> = ({ purchasedGitCommand }) => {
  const [close, setClose] = useState<boolean>(false);
  const [_purchasedGitCommand, setPurchasedGitCommand] =
    useState<IGitCommand | null>(null);
  useKeyPress("Escape", () => {
    setClose(true);
  });

  useEffect(() => {
    if (
      _purchasedGitCommand?.gitCommandType !==
      purchasedGitCommand.gitCommandType
    ) {
      setClose(false);
      setPurchasedGitCommand(purchasedGitCommand);
    }
  }, [purchasedGitCommand]);

  if (close) return <></>;
  return (
    <div className="popup">
      <p className="popup-unlocked">New command unlocked!</p>
      <div className="popup-modal">
        <h1 className="popup-modal-title">{purchasedGitCommand.name()}</h1>
        <div className="popup-modal-description">
          <HighlightText text={purchasedGitCommand.description()} />
        </div>
        <div className="popup-modal-usecase">
          <HighlightText text={purchasedGitCommand.useCase} />
        </div>
      </div>
      <div className="popup-close-button" onClick={() => setClose(true)}>
        <ThemeProvider theme={theme}>
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </ThemeProvider>
      </div>
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

export default CommandPopup;

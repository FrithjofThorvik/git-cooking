import { useEffect, useState } from "react";

import { IGitCooking } from "types/gameDataInterfaces";

export const useInfoBoxText = (gameData: IGitCooking) => {
  const [infoText, setInfoText] = useState<string>("");

  useEffect(() => {
    const git = gameData.git;
    // State 1: No commits have been made
    if (git.commits.length === 1) {
      // No actions have been made
      if (git.modifiedItems.length === 0 && git.stagedItems.length === 0)
        setInfoText(
          `Fulfill the orders above. Start with %${
            gameData.orderService.getAllOrders()[0].name
          }'s% order!`
        );
      // First time creating a file
      else if (git.stagedItems.length === 0 && git.modifiedItems.length > 0)
        setInfoText(
          `When finished, add your changes with %git add% in your terminal`
        );
      // First time adding a file
      else if (git.commits.length === 1 && git.stagedItems.length > 0)
        setInfoText(
          `Commit your added changes with %git commit% in your terminal`
        );
      else setInfoText("...");
    }
    // State 4: Committed for the first time
    else if (git.commits.length > 1 && !gameData.states.isDayComplete) {
      const allOrdersCount = gameData.orderService.getAllOrders().length;
      const availableOrdersCount =
        gameData.orderService.getAvailableOrders().length;
      // Not all orders have been presented yet
      if (availableOrdersCount < allOrdersCount) {
        setInfoText(`Fulfill as many orders as you can before the day ends`);
      } else if (availableOrdersCount === allOrdersCount) {
        setInfoText(
          `When finished, %git push% your work to the branch you pulled orders from`
        );
      } else setInfoText("...");
    }
    // State [X]: Day is completed
    else if (gameData.states.isDayComplete) {
      setInfoText(`Finish up, and %git push% to the branch you pulled from`);
    } else setInfoText("...");
  }, [gameData]);

  return infoText;
};

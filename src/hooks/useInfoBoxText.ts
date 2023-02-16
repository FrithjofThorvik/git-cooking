import { useEffect, useState } from "react";
import { TutorialType } from "types/enums";

import { IGitCooking } from "types/gameDataInterfaces";

export const useInfoBoxText = (gameData: IGitCooking, isPushed: boolean) => {
  const [infoText, setInfoText] = useState<string>("");

  useEffect(() => {
    const git = gameData.git;
    // State 1: No orders available
    if (gameData.orderService.getAllOrders().length === 0) {
      setInfoText(
        `There are %no orders% to be fullfilled in this branch. Please use %git checkout <branch_name>% to access another branch.`
      );
    }
    // State 2: No commits have been made
    else if (git.commits.length === 1) {
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
    // State 3: Committed for the first time
    else if (
      git.commits.length > 1 &&
      !gameData.states.isDayComplete &&
      !isPushed
    ) {
      const allOrdersCount = gameData.orderService.getAllOrders().length;
      const availableOrdersCount =
        gameData.orderService.getAvailableOrders().length;
      const pushTutorial = gameData.help.getTutorialsByTypes([
        TutorialType.WORK_PUSH,
      ]);

      // Not all orders have been presented yet
      if (availableOrdersCount < allOrdersCount) {
        setInfoText(`Fulfill as many orders as you can before the day ends`);
      } else if (!pushTutorial.every((t) => t.completed)) {
        setInfoText(
          `Make sure complete all orders. Remember to use %git add .% and %git commit -m [msg]%`
        );
      } else {
        setInfoText(
          `When finished, %git push% your work to the branch you pulled orders from`
        );
      }
    }
    // State 4: Day is completed
    else if (gameData.states.isDayComplete && !isPushed) {
      setInfoText(`Finish up, and %git push% to the branch you pulled from`);
    }
    // State 5: Pushed items for the first time
    else if (isPushed) {
      setInfoText(
        `You can %git checkout% other branches to make more progress, or %end the day% right away`
      );
    } else setInfoText("...");
  }, [gameData, isPushed]);

  return infoText;
};

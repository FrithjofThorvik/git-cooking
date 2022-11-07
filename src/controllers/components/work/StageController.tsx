import React from "react";

import Stage from "components/work/Stage";
import { useGameData, setGameData } from "hooks/useGameData";

interface IStageControllerProps {}

const StageController: React.FC<IStageControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const orders = [];
  gameData.gitStagedItems.forEach((item) => {
    return {
      name: "julian",
      percent: 45,
      files: [],
    };
  });
  return (
    <Stage orders={[{ name: "Julian", percent: 45, files: ["Burger"] }]} />
  );
};

export default StageController;

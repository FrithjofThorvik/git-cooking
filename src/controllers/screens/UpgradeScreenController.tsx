import React from "react";

import { IUpgrade } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import UpgradeScreen from "components/screens/UpgradeScreen";

interface IUpgradeScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const UpgradeScreenController: React.FC<IUpgradeScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const gameData = useGameData();

  const purchaseUpgrade = (upgrade: IUpgrade) => {
    const updatedStore = gameData.store.purchaseUpgrade(upgrade);
    setGameData({ ...gameData, store: updatedStore });
  };

  return (
    <UpgradeScreen
      goNext={goNext}
      goBack={goBack}
      cash={gameData.store.cash}
      upgrades={gameData.store.upgrades}
      purchaseUpgrade={purchaseUpgrade}
    />
  );
};

export default UpgradeScreenController;

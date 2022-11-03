import React from "react";

import { useGameData } from "hooks/useGameData";
import UpgradeScreen from "components/screens/UpgradeScreen";
import { IUpgrade } from "types/interfaces";

interface IUpgradeScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const UpgradeScreenController: React.FC<IUpgradeScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const { gameData, setGameData } = useGameData();

  const purchaseUpgrade = (upgrade: IUpgrade) => {
    if (
      upgrade.price <= gameData.cash &&
      !upgrade.purchased &&
      upgrade.unlocked
    ) {
      setGameData({
        ...gameData,
        upgrades: [
          // update upgrade to purchased
          ...gameData.upgrades.map((obj) => {
            if (obj.id === upgrade.id) {
              return { ...obj, purchased: true };
            }
            return obj;
          }),
        ],
        cash: gameData.cash - upgrade.price, //update cash
      });
    }
  };

  return (
    <UpgradeScreen
      goNext={goNext}
      goBack={goBack}
      cash={gameData.cash}
      upgrades={gameData.upgrades}
      purchaseUpgrade={purchaseUpgrade}
    />
  );
};

export default UpgradeScreenController;

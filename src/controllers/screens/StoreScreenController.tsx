import React from "react";

import { StoreItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import StoreScreen from "components/screens/StoreScreen";

interface IStoreScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const StoreScreenController: React.FC<IStoreScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const gameData = useGameData();

  const purchase = (purchasable: StoreItem, discountMultiplier: number) => {
    const updatedStore = gameData.store.purchase(
      purchasable,
      discountMultiplier
    );
    setGameData({ ...gameData, store: updatedStore });
  };

  return (
    <StoreScreen
      store={gameData.store}
      stats={gameData.stats}
      goNext={goNext}
      goBack={goBack}
      purchase={purchase}
    />
  );
};

export default StoreScreenController;

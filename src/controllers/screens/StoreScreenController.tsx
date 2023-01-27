import React from "react";

import { TutorialType } from "types/enums";
import { IStats, StoreItem } from "types/gameDataInterfaces";
import { setGameData, useGameData } from "hooks/useGameData";
import StoreScreen from "components/screens/StoreScreen";

interface IStoreScreenControllerProps {
  goNext: () => void;
  goBack: () => void;

  setActiveTutorialTypes: (tutorials: TutorialType[]) => void;
}

const StoreScreenController: React.FC<IStoreScreenControllerProps> = ({
  goNext,
  goBack,
  setActiveTutorialTypes,
}): JSX.Element => {
  const gameData = useGameData();

  const purchase = (purchasable: StoreItem, _stats: IStats) => {
    const { store, stats } = gameData.store.purchase(purchasable, _stats);
    setGameData({ ...gameData, store: store, stats: stats });
  };

  return (
    <StoreScreen
      day={gameData.states.day}
      store={gameData.store}
      stats={gameData.stats}
      help={gameData.help}
      setActiveTutorialTypes={setActiveTutorialTypes}
      goNext={goNext}
      goBack={goBack}
      purchase={purchase}
    />
  );
};

export default StoreScreenController;

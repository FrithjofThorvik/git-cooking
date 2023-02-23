import React, { useState } from "react";

import { IGitCommand, StoreItem } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import { copyObjectWithoutRef } from "services/helpers";
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
  const [purchasedGitCommand, setPurchasedGitCommand] = useState<
    IGitCommand | undefined
  >(undefined);

  const purchase = (purchasable: StoreItem) => {
    const { store, stats } = gameData.store.purchase(
      purchasable,
      gameData.stats
    );
    const gitCommand = gameData.store.gitCommands.find(
      (c) => c.gitCommandType === purchasable.gitCommandType
    );
    setPurchasedGitCommand(gitCommand);
    setGameData({ ...gameData, store: store, stats: stats });
  };

  return (
    <StoreScreen
      day={gameData.states.day}
      purchasedGitCommand={purchasedGitCommand}
      hasStartedFetch={gameData.states.hasStartedFetch}
      store={copyObjectWithoutRef(gameData.store)}
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

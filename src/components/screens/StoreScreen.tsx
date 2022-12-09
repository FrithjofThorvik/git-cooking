import React, { useEffect, useState } from "react";

import {
  IHelp,
  IIngredient,
  IStats,
  IStore,
  ITutorial,
  StoreItem,
} from "types/gameDataInterfaces";
import { PurchaseType, TutorialType } from "types/enums";
import Store from "components/store/Store";
import Tutorial from "components/Tutorials";
import StoreNav from "components/store/StoreNav";
import MenuButton from "components/MenuButton";
import HelpButton from "components/HelpButton";
import Background from "components/Background";

import "./StoreScreen.scss";
import { INewUnlockedItems } from "types/interfaces";

export interface IStoreScreenProps {
  day: number;
  help: IHelp;
  store: IStore;
  stats: IStats;
  goNext: () => void;
  goBack: () => void;
  purchase: (purchasable: StoreItem, _stats: IStats) => void;
  openHelpScreen: () => void;
  completeTutorial: (tutorial: ITutorial) => void;
}

const StoreScreen: React.FC<IStoreScreenProps> = ({
  day,
  help,
  store,
  stats,
  goNext,
  goBack,
  purchase,
  openHelpScreen,
  completeTutorial,
}): JSX.Element => {
  const [activePurchaseType, setActivePurchaseType] = useState<PurchaseType>(
    PurchaseType.UPGRADES
  );
  const [activeStoreItems, setActiveStoreItems] = useState<StoreItem[]>(
    store.upgrades
  );
  const [activeTutorials, setActiveTutorials] = useState<ITutorial[]>([]);
  const [newUnlockedItems, setNewUnlockedItems] = useState<INewUnlockedItems>({
    upgrades: 0,
    gitCommands: 0,
    ingredients: 0,
  });

  useEffect(() => {
    switch (activePurchaseType) {
      case PurchaseType.UPGRADES:
        setActiveStoreItems(store.upgrades);
        setActiveTutorials(
          help.getTutorialsByTypes([TutorialType.STORE_UPGRADES])
        );
        break;
      case PurchaseType.COMMANDS:
        setActiveStoreItems(store.gitCommands);
        break;
      case PurchaseType.INGREDIENTS:
        let ingredients: IIngredient[] = [];
        store.foods.forEach((f) => {
          Object.values(f.ingredients).forEach((i) => {
            if (!i.default) ingredients.push(i);
          });
        });
        setActiveStoreItems(ingredients);
        setActiveTutorials(
          help.getTutorialsByTypes([TutorialType.STORE_INGREDIENTS])
        );
        break;
      default:
        break;
    }
  }, [activePurchaseType, store, help]);

  useEffect(() => {
    let newUnlockedIngredients = 0;
    let newUnlockedGitCommands = 0;
    let newUnlockedUpgrades = 0;
    store.foods.forEach((f) =>
      Object.values(f.ingredients).forEach((i) => {
        if (i.unlockDay === day && !i.purchased) newUnlockedIngredients += 1;
      })
    );
    store.upgrades.forEach((u) => {
      if (u.unlockDay === day && u.level === 1) newUnlockedUpgrades += 1;
    });
    store.gitCommands.forEach((g) => {
      if (g.unlockDay === day && !g.purchased) newUnlockedGitCommands += 1;
    });
    setNewUnlockedItems({
      upgrades: newUnlockedUpgrades,
      ingredients: newUnlockedIngredients,
      gitCommands: newUnlockedGitCommands,
    });
  }, [day, store]);

  return (
    <Background>
      <div className="store-screen">
        <div className="store-screen-top">
          <Store
            day={day}
            availableCash={store.cash}
            activeStoreItems={activeStoreItems.sort(
              (a, b) => a.unlockDay - b.unlockDay
            )}
            stats={stats}
            purchase={purchase}
          />
        </div>
        <div className="store-screen-bottom">
          <MenuButton onClick={goBack} text="Results" type="default" />
          <StoreNav
            cash={store.cash}
            newUnlockedItems={newUnlockedItems}
            activePurchaseType={activePurchaseType}
            setActivePurchaseType={setActivePurchaseType}
          />
          <MenuButton onClick={goNext} text="New day" type="green" />
        </div>
        <Tutorial
          tutorials={activeTutorials}
          hideOnCompletion={true}
          completeTutorial={completeTutorial}
        />
        <HelpButton onClick={openHelpScreen} isOpen={false} />
      </div>
    </Background>
  );
};

export default StoreScreen;

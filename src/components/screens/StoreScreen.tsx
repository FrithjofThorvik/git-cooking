import React, { useEffect, useState } from "react";

import {
  IGitCommand,
  IHelp,
  IIngredient,
  IStats,
  IStore,
  StoreItem,
} from "types/gameDataInterfaces";
import { IngredientType, PurchaseType, TutorialType } from "types/enums";
import Store from "components/store/Store";
import StoreNav from "components/store/StoreNav";
import MenuButton from "components/MenuButton";
import Background from "components/Background";

import "./StoreScreen.scss";
import { INewUnlockedItems } from "types/interfaces";
import CommandPopup from "components/store/CommandPopup";

export interface IStoreScreenProps {
  day: number;
  help: IHelp;
  store: IStore;
  stats: IStats;
  purchasedGitCommand: IGitCommand | undefined;
  hasStartedFetch: boolean;
  goNext: () => void;
  goBack: () => void;
  purchase: (purchasable: StoreItem) => void;
  setActiveTutorialTypes: (tutorials: TutorialType[]) => void;
}

const StoreScreen: React.FC<IStoreScreenProps> = ({
  day,
  help,
  store,
  stats,
  purchasedGitCommand,
  hasStartedFetch,
  goNext,
  goBack,
  purchase,
  setActiveTutorialTypes,
}): JSX.Element => {
  const [activePurchaseType, setActivePurchaseType] = useState<PurchaseType>(
    PurchaseType.UPGRADES
  );
  const [activeStoreItems, setActiveStoreItems] = useState<StoreItem[]>(
    store.upgrades
  );
  const [newUnlockedItems, setNewUnlockedItems] = useState<INewUnlockedItems>({
    upgrades: 0,
    gitCommands: 0,
    ingredients: {
      total: 0,
      burger: 0,
      extra: 0,
    },
  });

  useEffect(() => {
    switch (activePurchaseType) {
      case PurchaseType.UPGRADES:
        setActiveStoreItems(store.upgrades);
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
        break;
      default:
        break;
    }
  }, [activePurchaseType, store, help]);

  useEffect(() => {
    let newUnlockedIngredients = {
      total: 0,
      extra: 0,
      burger: 0,
    };
    let newUnlockedGitCommands = 0;
    let newUnlockedUpgrades = 0;
    store.foods.forEach((f) =>
      Object.values(f.ingredients).forEach((i) => {
        if (i.unlockDay === day && !i.purchased) {
          if (i.type === IngredientType.BURGER)
            newUnlockedIngredients.burger += 1;
          if (i.type === IngredientType.EXTRA)
            newUnlockedIngredients.extra += 1;

          newUnlockedIngredients.total += 1;
        }
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
            newUnlockedItems={newUnlockedItems}
          />
        </div>
        <div className="store-screen-bottom">
          <MenuButton
            onClick={goBack}
            text="Results"
            type="left"
            hide={hasStartedFetch}
          />
          <StoreNav
            cash={store.cash}
            newUnlockedItems={newUnlockedItems}
            activePurchaseType={activePurchaseType}
            setActivePurchaseType={setActivePurchaseType}
          />
          <MenuButton
            onClick={goNext}
            text={`${hasStartedFetch ? "Continue" : "New day"}`}
            type="right"
          />
        </div>
        {purchasedGitCommand && (
          <CommandPopup purchasedGitCommand={purchasedGitCommand} />
        )}
      </div>
    </Background>
  );
};

export default StoreScreen;

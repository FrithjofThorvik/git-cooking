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

import "./StoreScreen.scss";
import Background from "components/Background";

export interface IStoreScreenProps {
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

  return (
    <Background>
      <div className="store-screen">
        <div className="store-screen-top">
          <Store
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

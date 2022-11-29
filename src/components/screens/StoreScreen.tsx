import React, { useEffect, useState } from "react";

import {
  IIngredient,
  IStats,
  IStore,
  StoreItem,
} from "types/gameDataInterfaces";
import { PurchaseType } from "types/enums";
import Store from "components/store/Store";
import StoreNav from "components/store/StoreNav";
import MenuButton from "components/MenuButton";

import "./StoreScreen.scss";

export interface IStoreScreenProps {
  store: IStore;
  stats: IStats;
  goNext: () => void;
  goBack: () => void;
  purchase: (storeItem: StoreItem, discountMulitplier: number) => void;
}

const StoreScreen: React.FC<IStoreScreenProps> = ({
  store,
  stats,
  goNext,
  goBack,
  purchase,
}): JSX.Element => {
  const [activePurchaseType, setActivePurchaseType] = useState<PurchaseType>(
    PurchaseType.UPGRADES
  );
  const [activeStoreItems, setActiveStoreItems] = useState<StoreItem[]>(
    store.upgrades
  );

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
          Object.values(f.ingredients).forEach((i) => ingredients.push(i));
        });
        setActiveStoreItems(ingredients);
        break;
      default:
        break;
    }
  }, [activePurchaseType, store]);

  return (
    <div className="store-screen">
      <div className="store-screen-top">
        <Store
          availbaleCash={store.cash}
          activeStoreItems={activeStoreItems}
          discountMultiplier={stats.discountMultiplier.get(store.upgrades)}
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
    </div>
  );
};

export default StoreScreen;

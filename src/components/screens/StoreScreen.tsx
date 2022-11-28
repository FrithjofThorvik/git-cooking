import React, { useEffect, useState } from "react";

import { PurchaseType } from "types/enums";
import { IIngredient, IStore, StoreItem } from "types/gameDataInterfaces";
import MenuButton from "components/MenuButton";
import StoreNav from "components/store/StoreNav";

import "./StoreScreen.scss";
import Store from "components/store/Store";

export interface IStoreScreenProps {
  store: IStore;
  goNext: () => void;
  goBack: () => void;
  purchase: (storeItem: StoreItem) => void;
}

const StoreScreen: React.FC<IStoreScreenProps> = ({
  store,
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

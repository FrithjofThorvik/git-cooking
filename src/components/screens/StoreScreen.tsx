import React, { useEffect, useState } from "react";

import { PurchaseType } from "types/enums";
import { IIngredient, IPurchasable, IStore } from "types/gameDataInterfaces";
import MenuButton from "components/MenuButton";
import StoreCard from "components/store/StoreCard";
import StoreSidebar from "components/store/StoreSidebar";

import "./StoreScreen.scss";

export interface IStoreScreenProps {
  store: IStore;
  goNext: () => void;
  goBack: () => void;
  purchase: (purchasable: IPurchasable) => void;
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
  const [activePurchasables, setActivePurchasables] = useState<IPurchasable[]>(
    store.upgrades
  );

  useEffect(() => {
    switch (activePurchaseType) {
      case PurchaseType.UPGRADES:
        setActivePurchasables(store.upgrades);
        break;
      case PurchaseType.COMMANDS:
        setActivePurchasables(store.gitCommands);
        // TODO: Add git commands
        break;
      case PurchaseType.INGREDIENTS:
        let ingredients: IIngredient[] = [];
        store.foods.forEach((f) => {
          Object.values(f.ingredients).forEach((i) => ingredients.push(i));
        });
        setActivePurchasables(ingredients);
        break;
      default:
        break;
    }
  }, [activePurchaseType, store]);

  return (
    <div className="store-screen">
      <div className="store-screen-left">
        <StoreSidebar
          cash={store.cash}
          activePurchaseType={activePurchaseType}
          setActivePurchaseType={setActivePurchaseType}
        />
      </div>
      <div className="store-screen-right">
        <div className="store-screen-right-top">
          <div className="store-screen-right-top-items">
            {activePurchasables
              .sort((a, b) => Number(a.purchased) - Number(b.purchased))
              .map((purchasable) => (
                <StoreCard
                  key={purchasable.id}
                  cash={store.cash}
                  purchasable={purchasable}
                  purchase={purchase}
                />
              ))}
          </div>
        </div>
        <div className="store-screen-right-bottom">
          <div className="store-screen-right-bottom-buttons">
            <div className="store-screen-right-bottom-buttons-back-button">
              <MenuButton onClick={goBack} text="Results" type="default" />
            </div>
            <div className="store-screen-right-bottom-buttons-next-button">
              <MenuButton onClick={goNext} text="New day" type="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreScreen;

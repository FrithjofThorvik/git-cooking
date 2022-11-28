import React, { useEffect, useRef, useState } from "react";

import { useHover } from "hooks/useHover";
import { StoreItem } from "types/gameDataInterfaces";
import { isIngredient } from "services/typeGuards";
import { IngredientType } from "types/enums";
import StoreCard from "./StoreCard";
import StoreFoodSelector from "./StoreFoodSelector";

import "./Store.scss";

interface IStoreProps {
  availbaleCash: number;
  activeStoreItems: StoreItem[];
  purchase: (storeItem: StoreItem) => void;
}

const Store: React.FC<IStoreProps> = ({
  activeStoreItems,
  availbaleCash,
  purchase,
}): JSX.Element => {
  const itemsRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(itemsRef);
  const [activeFoodType, setActiveFoodType] = useState<IngredientType | null>(
    null
  );

  const filterFoodType = (storeItem: StoreItem): boolean => {
    if (!isIngredient(storeItem) || !activeFoodType) return true;
    if (storeItem.type === activeFoodType) return true;
    return false;
  };

  useEffect(() => {
    if (activeStoreItems.length > 0) {
      if (isIngredient(activeStoreItems[0]))
        setActiveFoodType(IngredientType.BURGER);
      else setActiveFoodType(null);
    }
  }, [activeStoreItems]);

  return (
    <div className="store">
      {activeFoodType && (
        <StoreFoodSelector
          activeType={activeFoodType}
          setType={(type: IngredientType) => setActiveFoodType(type)}
        />
      )}
      <div
        className={`store-items ${isHovered ? "hovered" : ""}`}
        ref={itemsRef}
      >
        {activeStoreItems.filter(filterFoodType).map((storeItem) => (
          <StoreCard
            key={storeItem.id}
            cash={availbaleCash}
            purchasable={storeItem}
            purchase={purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default Store;

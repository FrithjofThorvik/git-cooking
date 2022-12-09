import React, { useEffect, useRef, useState } from "react";

import { useHover } from "hooks/useHover";
import { IStats, StoreItem } from "types/gameDataInterfaces";
import { isIngredient } from "services/typeGuards";
import { IngredientType } from "types/enums";
import StoreCard from "./StoreCard";
import StoreFoodSelector from "./StoreFoodSelector";

import "./Store.scss";

interface IStoreProps {
  day: number;
  availableCash: number;
  activeStoreItems: StoreItem[];
  stats: IStats;
  purchase: (purchasable: StoreItem, _stats: IStats) => void;
}

const Store: React.FC<IStoreProps> = ({
  day,
  stats,
  availableCash,
  activeStoreItems,
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
            day={day}
            cash={availableCash}
            purchasable={storeItem}
            stats={stats}
            purchase={purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default Store;

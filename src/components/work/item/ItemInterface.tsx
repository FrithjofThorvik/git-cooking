import React, { useEffect, useState } from "react";

import { IngredientType } from "types/enums";
import { FoodType, IFood } from "types/foodInterfaces";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";

import "./ItemInterface.scss";

interface IItemInterfaceProps {
  activeItem: IOrderItem | null;
  foods: IFood[];
  modifyOrderItem: (
    orderItem: IOrderItem,
    data: {
      type?: IngredientType;
      addIngredient?: IIngredient;
      removeIngredientAtIndex?: number;
    }
  ) => void;
}

const ItemInterface: React.FC<IItemInterfaceProps> = ({
  activeItem,
  foods,
  modifyOrderItem,
}): JSX.Element => {
  const [foodTypeIngredients, setFoodTypeIngredients] = useState<FoodType>();

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    Object.values(IngredientType).forEach((val) => {
      if (val === e.target.value && activeItem) {
        modifyOrderItem(activeItem, { type: val });
      }
    });
  };

  useEffect(() => {
    for (let i = 0; i < foods.length; i++) {
      if (foods[i].type === activeItem?.type) {
        setFoodTypeIngredients(foods[i].ingredients);
      }
    }
  }, [activeItem?.type]);

  if (activeItem === null) return <></>;

  return (
    <div className="item-interface">
      <h1>{activeItem.name}</h1>
      <div className="item-interface-section">
        <div>Item type:</div>
        <select
          name="type"
          id="type"
          value={activeItem.type}
          onChange={handleTypeSelect}
        >
          {Object.values(IngredientType).map((val: IngredientType, i) => {
            return (
              <option key={i} value={val}>
                {val}
              </option>
            );
          })}
        </select>
      </div>
      <div className="item-interface-section">
        <div>Ingredients: </div>
        <div className="item-interface-section-ingredients">
          {activeItem.ingredients
            .filter((i) => i.purchased)
            .map((ing, i) => (
              <div
                key={i}
                className="item-interface-section-ingredients-ingredient"
                onClick={() =>
                  modifyOrderItem(activeItem, { removeIngredientAtIndex: i })
                }
              >
                {ing.name}
              </div>
            ))}
        </div>
        {foodTypeIngredients &&
          Object.values(foodTypeIngredients)
            .filter((i) => i.purchased)
            .map((ing, i) => (
              <button
                key={i}
                onClick={() =>
                  modifyOrderItem(activeItem, { addIngredient: ing })
                }
              >
                {ing.name}
              </button>
            ))}
      </div>
    </div>
  );
};

export default ItemInterface;

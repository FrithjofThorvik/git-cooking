import React, { useEffect, useState } from "react";
import { IngredientType } from "types/enums";

import {
  FoodType,
  IFood,
  IIngredient,
  IOrderItem,
} from "types/gameDataInterfaces";

import "./ItemInterface.scss";

interface IItemInterfaceProps {
  activeItem: IOrderItem | null;
  foods: IFood[];
  addIngredientToOrderItem: (
    orderItem: IOrderItem,
    ingredient: IIngredient
  ) => void;
  modifyOrderItem: (item: IOrderItem) => void;
  setOrderItemType: (orderItem: IOrderItem, type: IngredientType) => void;
  removeIngredientFromOrderItem: (orderItem: IOrderItem, index: number) => void;
}

const ItemInterface: React.FC<IItemInterfaceProps> = ({
  activeItem,
  foods,
  modifyOrderItem,
  setOrderItemType,
  addIngredientToOrderItem,
  removeIngredientFromOrderItem,
}): JSX.Element => {
  const [availableIngredients, setAvailableIngredients] = useState<FoodType>();
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);

  const handleTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    Object.values(IngredientType).forEach((val) => {
      if (val === e.target.value && activeItem) {
        setOrderItemType(activeItem, val);
      }
    });
  };

  useEffect(() => {
    for (let i = 0; i < foods.length; i++) {
      if (foods[i].type === activeItem?.type) {
        setAvailableIngredients(foods[i].ingredients);
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
          {activeItem.ingredients.map((ing, i) => (
            <div
              key={i}
              className="item-interface-section-ingredients-ingredient"
              onClick={() => removeIngredientFromOrderItem(activeItem, i)}
            >
              {ing.name}
            </div>
          ))}
        </div>
        {availableIngredients &&
          Object.values(availableIngredients).map((ing, i) => (
            <button
              key={i}
              onClick={() => addIngredientToOrderItem(activeItem, ing)}
            >
              {ing.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ItemInterface;

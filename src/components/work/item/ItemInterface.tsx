import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import StoreFoodSelector from "components/store/StoreFoodSelector";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";

import { IngredientType } from "types/enums";
import { FoodType, IFood } from "types/foodInterfaces";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import DisplayItem from "./DisplayItem";

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

  const handleTypeSelect = (type: IngredientType) => {
    Object.values(IngredientType).forEach((val) => {
      if (val === type && activeItem) {
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
      {/* Created Item */}
      <div className="item-interface-item">
        <DisplayItem
          item={activeItem}
          removeIngredient={(index: number) =>
            modifyOrderItem(activeItem, { removeIngredientAtIndex: index })
          }
        />
        {activeItem.ingredients.length > 0 && (
          <p>Remove items by clicking them...</p>
        )}
      </div>

      {/* Food Ingredients */}
      <div className="item-interface-ingredients">
        {foodTypeIngredients &&
          Object.values(foodTypeIngredients)
            .filter((i) => i.purchased)
            .map((ing) => (
              <Tooltip
                key={ing.id}
                title={ing.name}
                placement="bottom"
                arrow
                disableInteractive
              >
                <div
                  className="item-interface-ingredients-ingredient"
                  onClick={() =>
                    modifyOrderItem(activeItem, { addIngredient: ing })
                  }
                >
                  <img src={ing.image} alt={ing.name} />
                  <ForwardTwoToneIcon />
                </div>
              </Tooltip>
            ))}
      </div>

      {/* Food Types */}
      <div className="item-interface-types">
        <StoreFoodSelector
          activeType={activeItem.type}
          setType={handleTypeSelect}
        />
      </div>
    </div>
  );
};

export default ItemInterface;

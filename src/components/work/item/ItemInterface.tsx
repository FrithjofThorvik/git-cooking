import { Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import StoreFoodSelector from "components/store/StoreFoodSelector";
import ForwardTwoToneIcon from "@mui/icons-material/ForwardTwoTone";

import { useHover } from "hooks/useHover";
import { IngredientType } from "types/enums";
import { FoodType, IFood } from "types/foodInterfaces";
import { IIngredient, IOrderItem } from "types/gameDataInterfaces";
import DisplayItem from "./DisplayItem";

import "./ItemInterface.scss";
import HoverWarning from "components/HoverWarning";

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
  const itemRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(itemRef);
  const [foodTypeIngredients, setFoodTypeIngredients] = useState<FoodType>();
  const [showWarning, setShowWarning] = useState(false);
  const [declineWarning, setDeclineWarning] = useState(false);

  const handleTypeSelect = (type: IngredientType) => {
    const ingredients = activeItem?.ingredients;
    if (
      ingredients &&
      ingredients.length > 0 &&
      type !== activeItem?.type &&
      !showWarning &&
      !declineWarning
    ) {
      // if you have ingredients and try to change food type
      // and assuming you don't already have a warning, or have declined a previous warning
      // show warning
      setShowWarning(true);
    } else if (type !== activeItem?.type && (declineWarning || !showWarning)) {
      // if not setting show warning to true
      // if we are changing food type
      // and we don't have a warning currently, or we have declined a previous warning
      // change the active item
      Object.values(IngredientType).forEach((val) => {
        if (val === type && activeItem) {
          modifyOrderItem(activeItem, { type: val });
        }
      });
      setShowWarning(false);
      setDeclineWarning(false);
    }
  };

  useEffect(() => {
    for (let i = 0; i < foods.length; i++) {
      if (foods[i].type === activeItem?.type) {
        setFoodTypeIngredients(foods[i].ingredients);
      }
    }
  }, [activeItem?.type]);

  useEffect(() => {
    // If you changed the active item -> reset state
    setShowWarning(false);
    setDeclineWarning(false);
  }, [activeItem]);

  if (activeItem === null) return <></>;
  return (
    <div className="item-interface">
      <h1>{activeItem.name}</h1>
      {/* Created Item */}
      <div
        className={`item-interface-item ${isHovered ? "hovered" : ""}`}
        ref={itemRef}
      >
        <DisplayItem
          item={activeItem}
          size={75}
          removeIngredient={(index: number) =>
            modifyOrderItem(activeItem, { removeIngredientAtIndex: index })
          }
        />
      </div>
      {activeItem.ingredients.length > 0 && (
        <p>Remove items by clicking them...</p>
      )}

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
          showName={false}
        />
      </div>

      {/* Warning */}
      <HoverWarning
        show={showWarning}
        handleClickOutside={() => {
          // If you click outside the warning -> remove warning/decline warning
          setShowWarning(false);
          setDeclineWarning(true);
        }}
        text="%Warning!% Changing food type will %clear% your current item. Add a %new item% if you wish to serve your customer two foods."
      />
    </div>
  );
};

export default ItemInterface;

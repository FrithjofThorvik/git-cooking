import React, { useEffect, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { IIngredient, Item } from "types/gameDataInterfaces";

import "./IngredientItem.scss";

interface IIngredientItemProps {
  item: IIngredient;
  stagedItems: Item[];
  modifiedItems: Item[];
}

const IngredientItem: React.FC<IIngredientItemProps> = ({
  item,
  stagedItems,
  modifiedItems,
}): JSX.Element => {
  const [isStaged, setIsStaged] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  useEffect(() => {
    let newIsStaged = false;
    let newIsModified = false;

    for (let i = 0; i < stagedItems.length; i++) {
      if (stagedItems[i].path === item.path) newIsStaged = true;
    }
    for (let i = 0; i < modifiedItems.length; i++) {
      if (modifiedItems[i].path === item.path) newIsModified = true;
    }

    setIsModified(newIsModified);
    setIsStaged(newIsStaged);
  }, [stagedItems, modifiedItems]);

  return (
    <div
      className="ingredient-item"
      style={{
        color: `${isModified ? "orange" : isStaged ? "green" : "white"}`,
      }}
    >
      <DescriptionOutlinedIcon className="ingredient-item-icon" />
      <div>{item.name}</div>
    </div>
  );
};

export default IngredientItem;

import React, { useEffect, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { isOrderItem } from "services/helpers";
import { IOrderItem, Item } from "types/gameDataInterfaces";

import "./DirectoryItem.scss";

interface IDirectoryItemProps {
  item: Item;
  stagedItems: Item[];
  modifiedItems: Item[];
  modifyOrderItem: (order: IOrderItem) => void;
}

const DirectoryItem: React.FC<IDirectoryItemProps> = ({
  item,
  stagedItems,
  modifiedItems,
  modifyOrderItem,
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
      className="directory-file"
      style={{
        color: `${isModified ? "orange" : isStaged ? "green" : "white"}`,
      }}
      onClick={() => {
        if (isOrderItem(item)) modifyOrderItem(item);
      }}
    >
      <DescriptionOutlinedIcon className="directory-file-icon" />
      <div>{item.name}</div>
    </div>
  );
};

export default DirectoryItem;

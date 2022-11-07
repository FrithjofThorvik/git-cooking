import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IFood, IOrder, IOrderItem, Item } from "types/gameDataInterfaces";
import DirectoryItem from "./DirectoryItem";

import "./DirectoryFolder.scss";

interface IDirectoryFolderProps {
  folder: IOrder | IFood;
  stagedItems: Item[];
  modifiedItems: Item[];
  modifyOrderItem: (order: IOrderItem) => void;
}

const DirectoryFolder: React.FC<IDirectoryFolderProps> = ({
  folder,
  stagedItems,
  modifiedItems,
  modifyOrderItem,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="directory-folder">
      <div className="directory-folder-info" onClick={() => setIsOpen(!isOpen)}>
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{folder.name}</div>
      </div>
      {isOpen && (
        <div className="directory-folder-container">
          {folder.items.map((f, i) => {
            return (
              <DirectoryItem
                item={f}
                stagedItems={stagedItems}
                modifiedItems={modifiedItems}
                modifyOrderItem={modifyOrderItem}
                key={i}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DirectoryFolder;

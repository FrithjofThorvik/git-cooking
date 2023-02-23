import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import { PurchaseType } from "types/enums";
import { formatNumber } from "services/helpers";
import { INewUnlockedItems } from "types/interfaces";

import "./StoreNav.scss";

export interface IStoreNavProps {
  newUnlockedItems: INewUnlockedItems;
  activePurchaseType: PurchaseType;
  setActivePurchaseType: React.Dispatch<React.SetStateAction<PurchaseType>>;
  cash: number;
}

const StoreNav: React.FC<IStoreNavProps> = ({
  newUnlockedItems,
  activePurchaseType,
  setActivePurchaseType,
  cash,
}): JSX.Element => {
  const iconSwitch = (purchaseType: PurchaseType) => {
    switch (purchaseType) {
      case PurchaseType.UPGRADES:
        return <HomeOutlinedIcon />;
      case PurchaseType.COMMANDS:
        return <CodeOutlinedIcon />;
      case PurchaseType.INGREDIENTS:
        return <FastfoodOutlinedIcon />;
      default:
        return <CategoryOutlinedIcon />;
    }
  };

  const newUnlockedItemsCount = (purchaseType: PurchaseType) => {
    switch (purchaseType) {
      case PurchaseType.UPGRADES:
        return newUnlockedItems.upgrades;
      case PurchaseType.COMMANDS:
        return newUnlockedItems.gitCommands;
      case PurchaseType.INGREDIENTS:
        return newUnlockedItems.ingredients.total;
      default:
        return 0;
    }
  };

  return (
    <div className="store-nav">
      <div className="store-nav-cash">
        <p>
          <PaidOutlinedIcon />
          {formatNumber(cash, true)}
        </p>
      </div>
      <div className="store-nav-menu">
        {Object.values(PurchaseType).map((val: PurchaseType) => {
          return (
            <div
              className={`store-nav-menu-item ${
                val === activePurchaseType && "selected"
              }`}
              key={val}
              onClick={() => setActivePurchaseType(val)}
            >
              <div className="store-nav-menu-item-logo">{iconSwitch(val)}</div>
              <p>{val}</p>
              {newUnlockedItemsCount(val) > 0 && (
                <div className="store-nav-menu-item-new">
                  {newUnlockedItemsCount(val)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreNav;

import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import { PurchaseType } from "types/enums";

import "./StoreNav.scss";

export interface IStoreNavProps {
  activePurchaseType: PurchaseType;
  setActivePurchaseType: React.Dispatch<React.SetStateAction<PurchaseType>>;
  cash: number;
}

const StoreNav: React.FC<IStoreNavProps> = ({
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

  return (
    <div className="store-nav">
      <div className="store-nav-cash">
        <p>
          <PaidOutlinedIcon />
          {cash}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreNav;

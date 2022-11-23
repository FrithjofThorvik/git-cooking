import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import { imgLogo } from "assets";
import { PurchaseType } from "types/enums";
import GlassContainer from "components/GlassContainer";

import "./StoreSidebar.scss";

export interface IStoreSidebarProps {
  activePurchaseType: PurchaseType;
  setActivePurchaseType: React.Dispatch<React.SetStateAction<PurchaseType>>;
  cash: number;
}

const StoreSidebar: React.FC<IStoreSidebarProps> = ({
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
    <div className="store-sidebar">
      <GlassContainer>
        <div className="store-sidebar-content">
          <img src={imgLogo} className="store-sidebar-content-logo" />
          <div className="store-sidebar-content-menu">
            {Object.values(PurchaseType).map((val: PurchaseType) => {
              return (
                <div
                  className={`store-sidebar-content-menu-item ${
                    val === activePurchaseType && "selected"
                  }`}
                  key={val}
                  onClick={() => setActivePurchaseType(val)}
                >
                  <div className="store-sidebar-content-menu-item-logo">
                    {iconSwitch(val)}
                  </div>
                  <p>{val}</p>
                </div>
              );
            })}
          </div>
          <div className="store-sidebar-content-cash">
            <p>
              <PaidOutlinedIcon />
              {cash}
            </p>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default StoreSidebar;

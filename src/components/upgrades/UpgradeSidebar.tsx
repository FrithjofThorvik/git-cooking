import React from "react";

import { imgLogo } from "assets";
import { UpgradeType } from "types/enums";
import GlassContainer from "components/GlassContainer";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import "./UpgradeSidebar.scss";

export interface IUpgradeSidebarProps {
  activeUpgradeType: UpgradeType;
  setActiveUpgradeType: React.Dispatch<React.SetStateAction<UpgradeType>>;
}

const UpgradeSidebar: React.FC<IUpgradeSidebarProps> = ({
  activeUpgradeType,
  setActiveUpgradeType,
}): JSX.Element => {
  const iconSwitch = (upgradeType: UpgradeType) => {
    switch (upgradeType) {
      case UpgradeType.UPGRADES:
        return <HomeOutlinedIcon />;
      case UpgradeType.COMMANDS:
        return <CodeOutlinedIcon />;
      case UpgradeType.INGREDIENTS:
        return <FastfoodOutlinedIcon />;
      default:
        return <CategoryOutlinedIcon />;
    }
  };
  return (
    <div className="upgrade-sidebar">
      <GlassContainer>
        <div className="upgrade-sidebar-content">
          <img src={imgLogo} className="upgrade-sidebar-content-logo" />
          <div className="upgrade-sidebar-content-menu">
            {Object.values(UpgradeType).map((val: UpgradeType) => {
              return (
                <div
                  className={`upgrade-sidebar-content-menu-item ${
                    val === activeUpgradeType && "selected"
                  }`}
                  key={val}
                  onClick={() => setActiveUpgradeType(val)}
                >
                  <div className="upgrade-sidebar-content-menu-item-logo">
                    {iconSwitch(val)}
                  </div>
                  <p>{val}</p>
                </div>
              );
            })}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default UpgradeSidebar;

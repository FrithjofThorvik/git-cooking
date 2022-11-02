import React from "react";

import image from "assets/logo.png";
import GlassContainer from "components/GlassContainer";

import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";

import "./UpgradeSidebar.scss";
import { IUpgradeMenu } from "types/interfaces";

export interface IUpgradeSidebarProps {
  activeMenu: number;
  setActiveMenu: (id: number) => any;
  menu: IUpgradeMenu;
}

const UpgradeSidebar: React.FC<IUpgradeSidebarProps> = ({
  menu,
  activeMenu,
  setActiveMenu,
}): JSX.Element => {
  const iconSwitch = (icon: string | undefined) => {
    switch (icon) {
      case "home":
        return <HomeOutlinedIcon />;
      case "code":
        return <CodeOutlinedIcon />;
      case "fastfood":
        return <FastfoodOutlinedIcon />;
      default:
        return <CategoryOutlinedIcon />;
    }
  };

  return (
    <div className="upgrade-sidebar">
      <GlassContainer>
        <div className="upgrade-sidebar-content">
          <img src={image} className="upgrade-sidebar-content-logo" />
          <div className="upgrade-sidebar-content-menu">
            {menu.categories.map((item) => {
              let modifier = item.id == activeMenu ? "selected" : " ";
              return (
                <div
                  className={
                    "upgrade-sidebar-content-menu-item" + " " + modifier
                  }
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <div className="upgrade-sidebar-content-menu-item-logo">
                    {iconSwitch(item.icon)}
                  </div>
                  <p>{item.title}</p>
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

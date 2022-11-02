import React, { useState } from "react";

import UpgradeCard from "components/UpgradeCard";
import { IUpgradeCard, IUpgradeMenu } from "types/interfaces";
import UpgradeSidebar from "components/sidebars/UpgradeSidebar";
import MenuButton, { IMenuButtonProps } from "components/MenuButton";

import "./UpgradeScreen.scss";

export interface IUpgradeScreenProps {
  nextButton: IMenuButtonProps;
  prevButton: IMenuButtonProps;
  menu: IUpgradeMenu;
}

const UpgradeScreen: React.FC<IUpgradeScreenProps> = (props): JSX.Element => {
  const [activeMenu, setActiveMenu] = useState<number>(1);

  return (
    <div className="upgrade-screen">
      <div className="upgrade-screen-left">
        <UpgradeSidebar
          menu={props.menu}
          setActiveMenu={setActiveMenu}
          activeMenu={activeMenu}
        />
      </div>
      <div className="upgrade-screen-right">
        <div className="upgrade-screen-right-top">
          <div className="upgrade-screen-right-top-items">
            {props.menu.categories
              .filter((c) => c.id === activeMenu)
              .map((c) =>
                c.items.map((item, index) => (
                  <UpgradeCard
                    key={index}
                    item={item}
                    handleClick={() => props.menu.buyItem(item.id)}
                  />
                ))
              )}
          </div>
        </div>
        <div className="upgrade-screen-right-bottom">
          <div className="upgrade-screen-right-bottom-buttons">
            <div className="upgrade-screen-right-bottom-buttons-back-button">
              <MenuButton {...props.prevButton} />
            </div>
            <div className="upgrade-screen-right-bottom-buttons-next-button">
              <MenuButton {...props.nextButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;

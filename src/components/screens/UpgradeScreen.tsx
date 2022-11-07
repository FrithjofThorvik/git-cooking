import React, { useState } from "react";

import { IUpgrade } from "types/gameDataInterfaces";
import { UpgradeType } from "types/enums";
import MenuButton from "components/MenuButton";
import UpgradeCard from "components/upgrades/UpgradeCard";
import UpgradeSidebar from "components/upgrades/UpgradeSidebar";

import "./UpgradeScreen.scss";

export interface IUpgradeScreenProps {
  goNext: () => void;
  goBack: () => void;
  cash: number;
  upgrades: IUpgrade[];
  purchaseUpgrade: (upgrade: IUpgrade) => void;
}

const UpgradeScreen: React.FC<IUpgradeScreenProps> = ({
  upgrades,
  cash,
  goNext,
  goBack,
  purchaseUpgrade,
}): JSX.Element => {
  const [activeUpgradeType, setActiveUpgradeType] = useState<UpgradeType>(
    UpgradeType.UPGRADES
  );

  return (
    <div className="upgrade-screen">
      <div className="upgrade-screen-left">
        <UpgradeSidebar
          setActiveUpgradeType={setActiveUpgradeType}
          activeUpgradeType={activeUpgradeType}
          cash={cash}
        />
      </div>
      <div className="upgrade-screen-right">
        <div className="upgrade-screen-right-top">
          <div className="upgrade-screen-right-top-items">
            {upgrades
              .filter((upgrade) => upgrade.type === activeUpgradeType)
              .map((upgrade, index) => (
                <UpgradeCard
                  key={index}
                  upgrade={upgrade}
                  cash={cash}
                  purchaseUpgrade={() => purchaseUpgrade(upgrade)}
                />
              ))}
          </div>
        </div>
        <div className="upgrade-screen-right-bottom">
          <div className="upgrade-screen-right-bottom-buttons">
            <div className="upgrade-screen-right-bottom-buttons-back-button">
              <MenuButton onClick={goBack} text="RESULTS" type="default" />
            </div>
            <div className="upgrade-screen-right-bottom-buttons-next-button">
              <MenuButton onClick={goNext} text="NEXT DAY" type="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;

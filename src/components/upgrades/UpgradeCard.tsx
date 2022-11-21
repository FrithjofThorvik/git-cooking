import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { IUpgrade } from "types/gameDataInterfaces";
import GlassContainer from "components/GlassContainer";

import "./UpgradeCard.scss";

export interface IUpgradeCardProps {
  upgrade: IUpgrade;
  cash: number;
  purchaseUpgrade: () => void;
}

const UpgradeCard: React.FC<IUpgradeCardProps> = ({
  upgrade,
  cash,
  purchaseUpgrade,
}): JSX.Element => {
  return (
    <div
      className={`card ${
        upgrade.purchased
          ? "purchased"
          : upgrade.unlocked
          ? cash >= upgrade.cost
            ? ""
            : "notafford"
          : "locked"
      }`}
    >
      <GlassContainer triangle={false} grain={false} border>
        <div className="card-content">
          <div className="card-content-img">
            <img src={upgrade.image} alt={upgrade.image} />
          </div>
          <div className="card-content-title">
            <h2 className="card-content-title">{upgrade.name}</h2>
          </div>
          <div className="card-content-desc">
            <p className="card-content-desc">{upgrade.description}</p>
          </div>
          <div className="card-content-buy">
            <button
              className="card-content-buy-button"
              onClick={purchaseUpgrade}
            >
              {upgrade.purchased ? (
                <p className="card-content-buy-button-price">BOUGHT</p>
              ) : !upgrade.unlocked ? (
                <p className="card-content-buy-button-price">LOCKED</p>
              ) : (
                <p className="card-content-buy-button-price">
                  <PaidOutlinedIcon />
                  {upgrade.cost}
                </p>
              )}
            </button>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default UpgradeCard;

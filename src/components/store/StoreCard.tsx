import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { IStats, StoreItem } from "types/gameDataInterfaces";
import { formatNumber } from "services/helpers";
import { isIngredient, isUpgrade } from "services/typeGuards";

import "./StoreCard.scss";

export interface IStoreCardProps {
  cash: number;
  purchasable: StoreItem;
  stats: IStats;
  purchase: (purchasable: StoreItem, _stats: IStats) => void;
}

const StoreCard: React.FC<IStoreCardProps> = ({
  cash,
  purchasable,
  stats,
  purchase,
}): JSX.Element => {
  const cost = isIngredient(purchasable)
    ? purchasable.cost
    : purchasable.cost(stats.discountMultiplier.value);
  const description = isIngredient(purchasable)
    ? ""
    : purchasable.description();
  const name = isIngredient(purchasable)
    ? purchasable.name
    : purchasable.name();

  return (
    <div
      className={`card ${
        purchasable.purchased
          ? "purchased"
          : purchasable.unlocked === undefined || purchasable.unlocked
          ? cash >= cost
            ? ""
            : "notafford"
          : "locked"
      }`}
    >
      <div className="card-content">
        <div className="card-content-top">
          {isUpgrade(purchasable) && (
            <div
              className={`card-content-top-lvl ${
                purchasable.purchased ? "max" : ""
              }`}
            >
              {`${
                purchasable.purchased
                  ? `Max level`
                  : `Level: ${purchasable.level}`
              }`}
            </div>
          )}
          <div className="card-content-top-img">
            <img src={purchasable.image} alt={purchasable.image} />
          </div>
          <div className="card-content-top-title">
            <h2 className="card-content-top-title">{name}</h2>
          </div>
          <div className="card-content-top-desc">{description}</div>
        </div>
        <div className="card-content-bottom">
          {purchasable.purchased ? (
            <div className="card-content-bottom-purchased">
              <VerifiedIcon />
            </div>
          ) : (
            <div className="card-content-bottom-buy">
              <>
                {purchasable.unlocked !== undefined && !purchasable.unlocked ? (
                  <div className="card-content-bottom-locked-icon">
                    <LockOutlinedIcon />
                    <p>
                      Play to day <span>{purchasable.unlockDay}</span> to
                      unlock!
                    </p>
                  </div>
                ) : (
                  <button
                    className="card-content-bottom-buy-button"
                    onClick={() => purchase(purchasable, stats)}
                  >
                    <p className="card-content-bottom-buy-button-price">
                      <PaidOutlinedIcon />
                      {formatNumber(cost, true)}
                    </p>
                  </button>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;

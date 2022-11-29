import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { StoreItem } from "types/gameDataInterfaces";
import { isIngredient, isUpgrade } from "services/typeGuards";

import "./StoreCard.scss";

export interface IStoreCardProps {
  cash: number;
  purchasable: StoreItem;
  discountMultiplier: number;
  purchase: (purchasable: StoreItem, discountMultiplier: number) => void;
}

const StoreCard: React.FC<IStoreCardProps> = ({
  cash,
  purchasable,
  discountMultiplier,
  purchase,
}): JSX.Element => {
  const cost = isIngredient(purchasable)
    ? purchasable.cost
    : purchasable.cost(discountMultiplier);
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
                  </div>
                ) : (
                  <button
                    className="card-content-bottom-buy-button"
                    onClick={() => purchase(purchasable, discountMultiplier)}
                  >
                    <p className="card-content-bottom-buy-button-price">
                      <PaidOutlinedIcon />
                      {Math.round(cost)}
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

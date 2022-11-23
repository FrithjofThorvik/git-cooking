import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { IPurchasable } from "types/gameDataInterfaces";

import "./StoreCard.scss";

export interface IStoreCardProps {
  cash: number;
  purchasable: IPurchasable;
  purchase: (purchasable: IPurchasable) => void;
}

const StoreCard: React.FC<IStoreCardProps> = ({
  cash,
  purchasable,
  purchase,
}): JSX.Element => {
  return (
    <div
      className={`card ${
        purchasable.purchased
          ? "purchased"
          : purchasable.unlocked === undefined || purchasable.unlocked
          ? cash >= purchasable.cost
            ? ""
            : "notafford"
          : "locked"
      }`}
    >
      <div className="card-content">
        <div className="card-content-img">
          <img src={purchasable.image} alt={purchasable.image} />
        </div>
        <div className="card-content-title">
          <h2 className="card-content-title">{purchasable.name}</h2>
        </div>
        {purchasable?.description && (
          <div className="card-content-desc">
            <p className="card-content-desc">{purchasable.description}</p>
          </div>
        )}

        <div className="card-content-buy">
          <button
            className="card-content-buy-button"
            onClick={() => purchase(purchasable)}
          >
            {purchasable.purchased ? (
              <p className="card-content-buy-button-price">Purchased</p>
            ) : purchasable.unlocked !== undefined && !purchasable.unlocked ? (
              <>
                <p className="card-content-buy-button-price">Locked</p>
                <div className="card-content-locked-icon">
                  <LockOutlinedIcon />
                </div>
              </>
            ) : (
              <p className="card-content-buy-button-price">
                <PaidOutlinedIcon />
                {purchasable.cost}
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;

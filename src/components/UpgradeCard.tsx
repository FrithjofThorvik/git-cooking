import React, { useState } from "react";

import { IUpgradeCard, IUpgradeMenu } from "types/interfaces";
import GlassContainer from "components/GlassContainer";
import UpgradeSidebar from "components/sidebars/UpgradeSidebar";
import MenuButton, { IMenuButtonProps } from "components/MenuButton";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import "./UpgradeCard.scss";

export interface IUpgradeCardProps {
  item: IUpgradeCard;
  handleClick: () => void;
}

const UpgradeCard: React.FC<IUpgradeCardProps> = ({
  item,
  handleClick,
}): JSX.Element => {
  let cardClassName = "card";
  if (item.bought) cardClassName += " bought";
  if (!item.unlocked) cardClassName += " locked";
  return (
    <div className={cardClassName}>
      <GlassContainer triangle={false} grain={false} border>
        <div className="card-content">
          <div className="card-content-img">
            <img src={require(`../assets/${item.image}`)} alt={item.image} />
          </div>
          <div className="card-content-title">
            {" "}
            <h2 className="card-content-title">{item.title}</h2>
          </div>
          <div className="card-content-desc">
            {" "}
            <p className="card-content-desc">{item.description}</p>
          </div>
          <div className="card-content-buy">
            <button className="card-content-buy-button" onClick={handleClick}>
              {item.bought ? (
                <p className="card-content-buy-button-price">BOUGHT</p>
              ) : !item.unlocked ? (
                <p className="card-content-buy-button-price">LOCKED</p>
              ) : (
                <p className="card-content-buy-button-price">
                  <PaidOutlinedIcon />
                  {item.price}
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

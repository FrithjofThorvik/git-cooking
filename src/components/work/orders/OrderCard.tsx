import React from "react";
import AddIcon from "@mui/icons-material/Add";

import { imgChef } from "assets";
import GlassContainer from "components/GlassContainer";

import "./OrderCard.scss";

export interface IOrderCardProps {
  percent: number;
  items: { ingredients: string[] }[]
  name: string;
}

const OrderCard: React.FC<IOrderCardProps> = ({ percent, items, name }): JSX.Element => {
  return (
    <div className="order-card">
      <GlassContainer border shadow>
        <div className="order-card-content">
          <div className="order-card-content-person">
            <div className="order-card-content-person-name">{name}</div>
            <img src={imgChef} alt="chef" />
            <div className="order-card-content-person-progressBar">
              <div
                className="order-card-content-person-progressBar-progress"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
          <div className="order-card-content-coworker">
            <AddIcon />
          </div>
          <div className="order-card-content-items">
            {items.map((item, index) =>
              <div className="order-card-content-items-item" key={index}>
                {item.ingredients.map((i, index) =>
                  <img src={i} key={index} />
                )}
              </div>)
            }
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default OrderCard;

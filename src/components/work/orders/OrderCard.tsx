import React from "react";
import AddIcon from "@mui/icons-material/Add";

import { imgChef } from "assets";
import GlassContainer from "components/GlassContainer";

import "./OrderCard.scss";

interface IOrderCardProps {
  percent: number;
}

const OrderCard: React.FC<IOrderCardProps> = ({ percent }): JSX.Element => {
  return (
    <div className="order-card">
      <GlassContainer border shadow>
        <div className="order-card-content">
          <div className="order-card-content-person">
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
        </div>
      </GlassContainer>
    </div>
  );
};

export default OrderCard;

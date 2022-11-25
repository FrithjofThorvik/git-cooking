import React from "react";
import AddIcon from "@mui/icons-material/Add";

import { imgChef } from "assets";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import DisplayItem from "../item/DisplayItem";
import GlassContainer from "components/GlassContainer";

import "./OrderCard.scss";
import ProgressBar from "components/ProgressBar";

export interface IOrderCardProps {
  percent: number;
  percentageCompleted: number;
  items: IOrderItem[];
  order: IOrder;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  percent,
  items,
  order,
  percentageCompleted,
}): JSX.Element => {
  const borderColor = percentageCompleted >= 100 ? "#14c299" : "#94a3b8";
  const textColor = percentageCompleted >= 100 ? "#14c299" : "#eeeeee";
  const progressColor = percent >= 100 ? "#dc3c76" : "#14c299";

  return (
    <div className="order-card">
      <GlassContainer border shadow borderColor={borderColor}>
        <div className="order-card-content">
          <div className="order-card-content-person">
            <div
              className="order-card-content-person-info"
              style={{ color: textColor }}
            >
              {`${order.name} - ${Math.trunc(percentageCompleted)}%`}
            </div>
            <img
              src={imgChef}
              alt="chef"
              style={{ borderColor: borderColor }}
            />
            <div className="order-card-content-person-progressBar">
              <ProgressBar percent={percent} color={progressColor} />
            </div>
          </div>
          <div className="order-card-content-coworker">
            <AddIcon />
          </div>
          <div className="order-card-content-items">
            {items.map((item, index) => (
              <DisplayItem item={item} key={index} />
            ))}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default OrderCard;

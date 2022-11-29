import React from "react";

import { imgChef } from "assets";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import DisplayItem from "../item/DisplayItem";

import "./OrderCard.scss";

export interface IOrderCardProps {
  timerPercent: number;
  percentageCompleted: number;
  items: IOrderItem[];
  order: IOrder;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  timerPercent,
  items,
  order,
  percentageCompleted,
}): JSX.Element => {
  const borderColor = percentageCompleted >= 100 ? "#14c299" : "#94a3b8";
  const textColor = percentageCompleted >= 100 ? "#14c299" : "#eeeeee";

  return (
    <div
      className={`order-card ${percentageCompleted >= 100 ? "completed" : ""}`}
    >
      <div className="order-card-person">
        <div className="order-card-person-info" style={{ color: textColor }}>
          {`${order.name} - ${Math.trunc(percentageCompleted)}%`}
        </div>
        <img src={imgChef} alt="chef" style={{ borderColor: borderColor }} />
      </div>
      <div className="order-card-items">
        {items.map((item, index) => (
          <DisplayItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default OrderCard;

import React from "react";

import { imgChef } from "assets";
import { IOrder } from "types/gameDataInterfaces";
import DisplayItem from "../item/DisplayItem";

import "./OrderCard.scss";

export interface IOrderCardProps {
  order: IOrder;
}

const OrderCard: React.FC<IOrderCardProps> = ({ order }): JSX.Element => {
  const borderColor = order.percentageCompleted >= 100 ? "#14c299" : "#94a3b8";
  const textColor = order.percentageCompleted >= 100 ? "#14c299" : "#eeeeee";

  return (
    <div
      className={`order-card ${
        order.percentageCompleted >= 100 ? "completed" : ""
      }`}
    >
      <div className="order-card-person">
        <div className="order-card-person-info" style={{ color: textColor }}>
          {`${order.name} - ${Math.trunc(order.percentageCompleted)}%`}
        </div>
        <img src={imgChef} alt="chef" style={{ borderColor: borderColor }} />
      </div>
      <div className="order-card-items">
        {order.orderItems.map((item, index) => (
          <DisplayItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default OrderCard;

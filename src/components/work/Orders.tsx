import React from "react";

import OrderCard from "./orders/OrderCard";

import "./Orders.scss";
import { IOrder } from "types/gameDataInterfaces";

export interface IOrdersProps {
  orders: IOrder[];
  totalOrders: number;
  spawning: boolean;
}

const Orders: React.FC<IOrdersProps> = ({
  orders,
  spawning,
  totalOrders,
}): JSX.Element => {
  return (
    <div className="content">
      <p className="content-info">
        {orders.length}/{totalOrders} Orders
      </p>
      <div className="orders">
        {orders &&
          orders.map((order, index) => <OrderCard order={order} key={index} />)}
        {spawning && <p className="orders-new">New order arriving...</p>}
      </div>
    </div>
  );
};

export default Orders;

import React from "react";

import OrderCard from "./orders/OrderCard";

import "./Orders.scss";
import { IOrder } from "types/gameDataInterfaces";

export interface IOrdersProps {
  orders: IOrder[];
  spawning: boolean;
}

const Orders: React.FC<IOrdersProps> = ({ orders, spawning }): JSX.Element => {
  return (
    <div className="orders">
      {orders &&
        orders.map((order, index) => <OrderCard order={order} key={index} />)}
      {spawning && <p className="orders-new" >
        New order arriving...
      </p>}
    </div>
  );
};

export default Orders;

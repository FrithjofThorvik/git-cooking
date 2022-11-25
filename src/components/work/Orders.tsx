import React from "react";

import OrderCard, { IOrderCardProps } from "./orders/OrderCard";

import "./Orders.scss";

export interface IOrdersProps {
  orders: IOrderCardProps[];
}

const Orders: React.FC<IOrdersProps> = ({ orders }): JSX.Element => {
  return (
    <div className="orders">
      {orders &&
        orders.map((order, index) => <OrderCard {...order} key={index} />)}
    </div>
  );
};

export default Orders;

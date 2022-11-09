import React from "react";

import OrderCard, { IOrderCardProps } from "./orders/OrderCard";

import "./Orders.scss";

interface IOrdersProps {
  orders: IOrderCardProps[];
  generateOrder: () => void;
}

const Orders: React.FC<IOrdersProps> = ({ orders, generateOrder }): JSX.Element => {
  return (
    <div className="orders">
      {orders && orders.sort((a, b) =>
        a.percent < b.percent ? 1 : -1)
        .map((order, index) =>
          <OrderCard {...order} key={index} />
        )}
      <button onClick={generateOrder}>New Order</button>
    </div>
  );
};

export default Orders;

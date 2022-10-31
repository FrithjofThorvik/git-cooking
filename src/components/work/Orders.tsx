import React from "react";
import OrderCard from "./orders/OrderCard";

import "./Orders.scss";

interface IOrdersProps {}

const Orders: React.FC<IOrdersProps> = (): JSX.Element => {
  return (
    <div className="orders">
      <OrderCard percent={20} />
    </div>
  );
};

export default Orders;

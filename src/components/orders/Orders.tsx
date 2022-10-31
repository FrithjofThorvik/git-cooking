import React from "react";
import OrderCard from "./OrderCard";

import "./Orders.scss";

interface IOrdersProps {}

const Orders: React.FC<IOrdersProps> = (): JSX.Element => {
  return (
    <div className="orders">
      <OrderCard percent={50} />
    </div>
  );
};

export default Orders;

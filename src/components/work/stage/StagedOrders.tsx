import React from "react";
import StagedOrder from "./StagedOrder";

import "./StagedOrders.scss";

interface IStagedOrdersProps {
  orders: { name: string; percent: number; files: string[] }[];
}

const StagedOrders: React.FC<IStagedOrdersProps> = ({
  orders,
}): JSX.Element => {
  return (
    <div className="staged-orders">
      {orders &&
        orders.map((order, index) => (
          <StagedOrder
            name={order.name}
            percent={order.percent}
            files={order.files}
            key={index}
          />
        ))}
    </div>
  );
};

export default StagedOrders;

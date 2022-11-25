import React from "react";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import StagedOrder from "./StagedOrder";

import "./StagedOrders.scss";

interface IStagedOrdersProps {
  stagedOrders: {
    order: IOrder;
    items: IOrderItem[];
  }[];
}

const StagedOrders: React.FC<IStagedOrdersProps> = ({
  stagedOrders,
}): JSX.Element => {
  return (
    <div className="staged-orders">
      {stagedOrders &&
        stagedOrders.map((stagedOrder, index) => (
          <StagedOrder
            order={stagedOrder.order}
            items={stagedOrder.items}
            key={index}
          />
        ))}
    </div>
  );
};

export default StagedOrders;

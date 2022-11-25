import React from "react";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import StagedOrders from "./stage/StagedOrders";

import "./Stage.scss";

export interface IStageProps {
  stagedOrders: {
    order: IOrder;
    items: IOrderItem[];
  }[];
}

const Stage: React.FC<IStageProps> = ({ stagedOrders }): JSX.Element => {
  return (
    <div className="stage">
      <StagedOrders stagedOrders={stagedOrders} />
    </div>
  );
};

export default Stage;

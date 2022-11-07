import React from "react";

import StagedOrders from "./stage/StagedOrders";

import "./Stage.scss";

interface IStageProps {
  orders: { name: string; percent: number; files: string[] }[];
}

const Stage: React.FC<IStageProps> = ({ orders }): JSX.Element => {
  return (
    <div className="stage">
      <StagedOrders orders={orders} />
    </div>
  );
};

export default Stage;

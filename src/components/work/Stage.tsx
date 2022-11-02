import React from "react";

import StagedOrders from "./stage/StagedOrders";

import "./Stage.scss";

interface IStageProps {}

const Stage: React.FC<IStageProps> = (): JSX.Element => {
  return (
    <div className="stage">
      <StagedOrders />
    </div>
  );
};

export default Stage;

import React from "react";
import StagedOrder from "./StagedOrder";

import "./StagedOrders.scss";

interface IStagedOrdersProps {}

const StagedOrders: React.FC<IStagedOrdersProps> = (): JSX.Element => {
  return (
    <div className="staged-orders">
      <StagedOrder name={"Emanuel"} percent={100} />
      <StagedOrder name={"Jonas"} percent={66} />
    </div>
  );
};

export default StagedOrders;

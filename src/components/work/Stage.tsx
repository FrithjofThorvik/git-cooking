import React from "react";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";

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
      {stagedOrders.length > 0 ? (
        <StagedOrders stagedOrders={stagedOrders} />
      ) : (
        <div className="stage-empty">
          <ArchiveOutlinedIcon />
          <p>No added items...</p>
        </div>
      )}
    </div>
  );
};

export default Stage;

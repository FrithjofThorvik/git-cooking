import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import ProgressBar from "components/ProgressBar";
import DisplayItem from "../item/DisplayItem";

import "./StagedOrder.scss";

interface IStagedOrderProps {
  order: IOrder;
  items: IOrderItem[];
}

const StagedOrder: React.FC<IStagedOrderProps> = ({
  order,
  items,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const color =
    order.percentageCompleted > 66
      ? "#14c299"
      : order.percentageCompleted > 33
      ? "#fa9292"
      : "#dc3c76";

  return (
    <div className="staged-order" onClick={() => setIsOpen(!isOpen)}>
      <div className="staged-order-top" style={{ color }}>
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{order.name}</div>
        <div className="staged-order-top-progress">
          <div>{`${Math.trunc(order.percentageCompleted)}%`}</div>
          <ProgressBar percent={order.percentageCompleted} color={color} />
        </div>
      </div>
      {isOpen && (
        <div className="staged-order-items">
          {items &&
            items.map((item, index) => (
              <div key={index} className="staged-order-items-item">
                <DisplayItem item={item} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default StagedOrder;

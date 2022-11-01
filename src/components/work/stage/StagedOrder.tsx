import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ProgressBar from "components/ProgressBar";

import "./StagedOrder.scss";

interface IStagedOrderProps {
  name: string;
  percent: number;
}

const StagedOrder: React.FC<IStagedOrderProps> = ({
  name,
  percent,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const color = percent > 66 ? "#14c299" : percent > 33 ? "#fa9292" : "#dc3c76";

  return (
    <div
      className="staged-order"
      style={{ color: `${color}` }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="staged-order-top">
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{name}</div>
        <div className="staged-order-top-progress">
          <div>{`${percent}%`}</div>
          <ProgressBar percent={percent} color={color} />
        </div>
      </div>
      {isOpen && (
        <div className="staged-order-extra">
          <div>Burger</div>
          <div>Fries</div>
        </div>
      )}
    </div>
  );
};

export default StagedOrder;

import React from "react";

import { formatNumber } from "services/helpers";

import "./MergeStat.scss";

interface IMergeStatProps {
  text: string;
  value: number;
  maxValue?: number;
}

const MergeStat: React.FC<IMergeStatProps> = ({
  text,
  value,
  maxValue,
}): JSX.Element => {
  return (
    <div className="merge-stat">
      <p>{text}</p>
      <div className="merge-stat-value">
        {`${formatNumber(Math.abs(value), true)}`}
        <p className="merge-stat-value max">
          {maxValue != undefined
            ? `/ ${formatNumber(Math.abs(maxValue), true)}`
            : ""}
        </p>
      </div>
    </div>
  );
};

export default MergeStat;

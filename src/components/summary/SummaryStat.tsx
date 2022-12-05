import React from "react";

import { formatNumber } from "services/helpers";

import "./SummaryStat.scss";

interface ISummaryStatProps {
  text: string;
  value: number;
}

const SummaryStat: React.FC<ISummaryStatProps> = ({
  text,
  value,
}): JSX.Element => {
  return (
    <div className="summary-stat">
      <p>{text}</p>
      <p
        className={`summary-stat-value ${
          value > 0 ? "positive" : value < 0 ? "negative" : "neutral"
        }`}
      >{`${value > 0 ? "+" : value < 0 ? "-" : " "} ${formatNumber(
        Math.abs(value),
        true
      )}`}</p>
    </div>
  );
};

export default SummaryStat;

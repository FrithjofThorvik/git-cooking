import React from "react";

import { formatNumber } from "services/helpers";

import "./SummaryStat.scss";

interface ISummaryStatProps {
  text: string;
  value: number;
  maxValue?: number;
}

const SummaryStat: React.FC<ISummaryStatProps> = ({
  text,
  value,
  maxValue,
}): JSX.Element => {
  return (
    <div className="summary-stat">
      <p>{text}</p>
      <div
        className={`summary-stat-value ${
          value > 0 ? "positive" : value < 0 ? "negative" : "neutral"
        }`}
      >
        {`${value > 0 ? "+" : value < 0 ? "-" : " "} ${formatNumber(
          Math.abs(value),
          true
        )}`}
        <p
          className={`summary-stat-value max ${
            value > 0 ? "positive" : value < 0 ? "negative" : "neutral"
          }`}
        >
          {maxValue != undefined
            ? `/ ${formatNumber(Math.abs(maxValue), true)}`
            : ""}
        </p>
      </div>
    </div>
  );
};

export default SummaryStat;

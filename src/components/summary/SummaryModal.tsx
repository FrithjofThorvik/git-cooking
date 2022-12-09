import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { formatNumber } from "services/helpers";
import { ISummaryStats } from "types/interfaces";
import SummaryStat from "./SummaryStat";

import "./SummaryModal.scss";

export interface ISummaryModalProps {
  day: number;
  summaryStats: ISummaryStats;
}

const SummaryModal: React.FC<ISummaryModalProps> = ({
  day,
  summaryStats,
}): JSX.Element => {
  return (
    <div className="summary-modal">
      <div className="summary-modal-content">
        <div className="summary-modal-content-top">
          <div className="summary-modal-content-top-title">{`DAY ${day}`}</div>
          <div className="summary-modal-content-top-info">
            <SummaryStat
              text="Base revenue: "
              value={summaryStats.baseRevenue}
            />
            <SummaryStat
              text="Ingredients cost: "
              value={-summaryStats.baseCost}
            />
            <SummaryStat
              text="Early finish: "
              value={summaryStats.bonusFromEndedDayTime}
              maxValue={summaryStats.maxBonusFromEndedDayTime}
            />
            <SummaryStat
              text="Order accuracy: "
              value={summaryStats.bonusFromPercentage}
              maxValue={summaryStats.maxBonusFromPercentage}
            />
            <SummaryStat
              text="Revenue multiplier: "
              value={summaryStats.bonusFromMultiplier}
            />
            <SummaryStat
              text="Cost reduction: "
              value={summaryStats.bonusFromCostReduction}
            />
          </div>
          <div className="summary-modal-content-top-totals">
            <div className="summary-modal-content-top-totals-total">
              <p>Revenue: </p>
              <p className="summary-modal-content-top-totals-total-value positive">
                {formatNumber(summaryStats.totalRevenue, true)}
              </p>
            </div>
            <div className="summary-modal-content-top-totals-total">
              <p>Cost: </p>
              <p className="summary-modal-content-top-totals-total-value negative">
                {formatNumber(summaryStats.totalCost, true)}
              </p>
            </div>
          </div>
        </div>
        <div className="summary-modal-content-bottom">
          <p>Profit: </p>
          <p
            className={`${summaryStats.profit > 0 ? "color-default" : "color-negative"
              }`}
          >
            {formatNumber(summaryStats.profit, true)} <PaidOutlinedIcon />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;

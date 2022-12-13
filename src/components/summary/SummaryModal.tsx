import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { formatNumber } from "services/helpers";
import { ISummaryBranch } from "types/interfaces";
import SummaryStat from "./SummaryStat";

import "./SummaryModal.scss";

export interface ISummaryModalProps {
  summaryBranch: ISummaryBranch;
}

const SummaryModal: React.FC<ISummaryModalProps> = ({
  summaryBranch: summaryStats,
}): JSX.Element => {
  return (
    <div className="summary-modal">
      <div className="summary-modal-content">
        <div className="summary-modal-content-top">
          <div className="summary-modal-content-top-title">{`${summaryStats.name}`}</div>
          <div className="summary-modal-content-top-info">
            <SummaryStat
              text="Base revenue: "
              value={summaryStats.stats.baseRevenue}
            />
            <SummaryStat
              text="Ingredients cost: "
              value={-summaryStats.stats.baseCost}
            />
            <SummaryStat
              text="Early finish: "
              value={summaryStats.stats.bonusFromEndedDayTime}
              maxValue={summaryStats.stats.maxBonusFromEndedDayTime}
            />
            <SummaryStat
              text="Order accuracy: "
              value={summaryStats.stats.bonusFromPercentage}
              maxValue={summaryStats.stats.maxBonusFromPercentage}
            />
            <SummaryStat
              text="Revenue multiplier: "
              value={summaryStats.stats.bonusFromMultiplier}
            />
            <SummaryStat
              text="Cost reduction: "
              value={summaryStats.stats.bonusFromCostReduction}
            />
          </div>
          <div className="summary-modal-content-top-totals">
            <div className="summary-modal-content-top-totals-total">
              <p>Revenue: </p>
              <p className="summary-modal-content-top-totals-total-value positive">
                {formatNumber(summaryStats.stats.totalRevenue, true)}
              </p>
            </div>
            <div className="summary-modal-content-top-totals-total">
              <p>Cost: </p>
              <p className="summary-modal-content-top-totals-total-value negative">
                {formatNumber(summaryStats.stats.totalCost, true)}
              </p>
            </div>
          </div>
        </div>
        <div className="summary-modal-content-bottom">
          <p>Profit: </p>
          <p
            className={`${
              summaryStats.stats.profit > 0 ? "color-default" : "color-negative"
            }`}
          >
            {formatNumber(summaryStats.stats.profit, true)} <PaidOutlinedIcon />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;

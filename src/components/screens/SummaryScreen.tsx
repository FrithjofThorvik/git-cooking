import React from "react";

import { formatNumber } from "services/helpers";
import { ISummaryStats } from "types/interfaces";
import InfoText from "components/InfoText";
import MenuButton from "components/MenuButton";
import Background from "components/Background";
import SummaryModal from "components/summary/SummaryModal";

import "./SummaryScreen.scss";

export interface ISummaryScreenProps {
  day: number;
  summaryStats: ISummaryStats;
  goNext: () => void;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = ({
  day,
  summaryStats,
  goNext,
}): JSX.Element => {
  return (
    <Background>
      <div className="summary-screen">
        <div className="summary-screen-day">
          <h1>{`Day ${day}`}</h1>
        </div>
        <div className="summary-screen-branches">
          {summaryStats.branches
            .filter((b) => b.isMain)
            .map((b, i) => (
              <SummaryModal summaryBranch={b} key={i} />
            ))}
        </div>
        <InfoText
          text={`You earned %${formatNumber(
            summaryStats.totalProfit,
            true
          )}% today! Purchase more upgrades to increase your profits in the next screen`}
        />
        <div className="summary-screen-buttons">
          <div className="summary-screen-buttons-next-button">
            <MenuButton onClick={goNext} text="Next" type="right" />
          </div>
        </div>
      </div>
    </Background>
  );
};

export default SummaryScreen;

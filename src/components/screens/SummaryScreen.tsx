import React from "react";

import { ISummaryStats } from "types/interfaces";
import MenuButton from "components/MenuButton";
import HelpButton from "components/HelpButton";
import Background from "components/Background";
import SummaryModal from "components/summary/SummaryModal";

import "./SummaryScreen.scss";
import { formatNumber } from "services/helpers";

export interface ISummaryScreenProps {
  day: number;
  summaryStats: ISummaryStats;
  goNext: () => void;
  goBack: () => void;
  openHelpScreen: () => void;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = ({
  day,
  summaryStats,
  goNext,
  goBack,
  openHelpScreen,
}): JSX.Element => {
  return (
    <Background>
      <div className="summary-screen">
        <h1 className="summary-screen-day">
          {`Day ${day} - ${formatNumber(summaryStats.totalProfit, true)}`}
        </h1>
        <div className="summary-screen-branches">
          {summaryStats.branches.map((b, i) => (
            <SummaryModal summaryBranch={b} key={i} />
          ))}
        </div>
        <div className="summary-screen-buttons">
          <div className="summary-screen-buttons-back-button">
            <MenuButton onClick={goBack} text="Back" type="default" />
          </div>
          <div className="summary-screen-buttons-next-button">
            <MenuButton onClick={goNext} text="Next" type="green" />
          </div>
        </div>
        <HelpButton onClick={openHelpScreen} isOpen={false} />
      </div>
    </Background>
  );
};

export default SummaryScreen;

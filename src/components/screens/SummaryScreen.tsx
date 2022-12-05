import React from "react";

import MenuButton from "components/MenuButton";
import HelpButton from "components/HelpButton";
import SummaryModal from "components/summary/SummaryModal";

import "./SummaryScreen.scss";
import Background from "components/Background";

export interface ISummaryScreenProps {
  day: number;
  cost: number;
  revenue: number;
  goNext: () => void;
  goBack: () => void;
  openHelpScreen: () => void;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = ({
  day,
  cost,
  revenue,
  goNext,
  goBack,
  openHelpScreen,
}): JSX.Element => {
  return (
    <Background>
      <div className="summary-screen">
        <SummaryModal day={day} cost={cost} revenue={revenue} />
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

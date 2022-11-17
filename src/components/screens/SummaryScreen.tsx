import React from "react";

import MenuButton from "components/MenuButton";
import SummaryModal from "components/summary/SummaryModal";

import "./SummaryScreen.scss";

export interface ISummaryScreenProps {
  day: number;
  cost: number;
  revenue: number;
  goNext: () => void;
  goBack: () => void;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = ({
  day,
  cost,
  revenue,
  goNext,
  goBack,
}): JSX.Element => {
  return (
    <div className="summary-screen">
      <SummaryModal day={day} cost={cost} revenue={revenue} />
      <div className="summary-screen-buttons">
        <div className="summary-screen-buttons-back-button">
          <MenuButton onClick={goBack} text="BACK" type="default" />
        </div>
        <div className="summary-screen-buttons-next-button">
          <MenuButton onClick={goNext} text="NEXT" type="green" />
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;

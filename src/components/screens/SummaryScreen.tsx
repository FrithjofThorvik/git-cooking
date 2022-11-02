import React from "react";

import SummaryModal, {
  ISummaryModalProps,
} from "components/summary/SummaryModal";
import MenuButton from "components/MenuButton";

import "./SummaryScreen.scss";

export interface ISummaryScreenProps {
  modal: ISummaryModalProps;
  goNext: () => void;
  goBack: () => void;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = ({
  modal,
  goNext,
  goBack,
}): JSX.Element => {
  return (
    <div className="summary-screen">
      <SummaryModal {...modal} />
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

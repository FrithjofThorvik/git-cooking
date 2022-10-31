import React from "react";

import SummaryModal, {
  ISummaryModalProps,
} from "components/summary/SummaryModal";
import SummaryButton, {
  ISummaryButtonProps,
} from "components/summary/SummaryButton";

import "./SummaryScreen.scss";

export interface ISummaryScreenProps {
  modal: ISummaryModalProps;
  nextButton: ISummaryButtonProps;
  prevButton: ISummaryButtonProps;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = (props): JSX.Element => {
  return (
    <div className="summary-screen">
      <SummaryModal {...props.modal} />
      <div className="summary-screen-buttons">
        <div className="summary-screen-buttons-back-button">
          <SummaryButton {...props.nextButton} />
        </div>
        <div className="summary-screen-buttons-next-button">
          <SummaryButton {...props.prevButton} />
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;

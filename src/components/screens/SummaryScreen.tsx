import React from "react";
import SummaryButton, { ISummaryButtonProps } from "../misc/SummaryButton";
import SummaryModal, { ISummaryModalProps } from "../SummaryModal";

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
        <div className="summary-screen-back-button">
          <SummaryButton {...props.nextButton} />
        </div>
        <div className="summary-screen-next-button">
          <SummaryButton {...props.prevButton} />
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;

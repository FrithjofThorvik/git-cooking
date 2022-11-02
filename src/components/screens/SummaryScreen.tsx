import React from "react";

import SummaryModal, {
  ISummaryModalProps,
} from "components/summary/SummaryModal";
import MenuButton, { IMenuButtonProps } from "components/MenuButton";

import "./SummaryScreen.scss";

export interface ISummaryScreenProps {
  modal: ISummaryModalProps;
  nextButton: IMenuButtonProps;
  prevButton: IMenuButtonProps;
}

const SummaryScreen: React.FC<ISummaryScreenProps> = (props): JSX.Element => {
  return (
    <div className="summary-screen">
      <SummaryModal {...props.modal} />
      <div className="summary-screen-buttons">
        <div className="summary-screen-buttons-back-button">
          <MenuButton {...props.prevButton} />
        </div>
        <div className="summary-screen-buttons-next-button">
          <MenuButton {...props.nextButton} />
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;

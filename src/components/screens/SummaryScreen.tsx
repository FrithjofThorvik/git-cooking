import React from "react";
import SummaryButton, { ISummaryButtonProps } from "../misc/SummaryButton";
import SummaryModal, { ISummaryModalProps } from "../SummaryModal";

export interface ISummaryScreenProps { modal: ISummaryModalProps; nextButton: ISummaryButtonProps; prevButton: ISummaryButtonProps; }

const SummaryScreen: React.FC<
    ISummaryScreenProps
> = (props): JSX.Element => {
    return <div className="summary-screen">
        <div className="summary-screen-back-button">
            <SummaryButton {...props.nextButton} />
        </div>
        <SummaryModal {...props.modal} />
        <div className="summary-screen-next-button">
            <SummaryButton {...props.prevButton} />
        </div>
    </div>;
};

export default SummaryScreen;
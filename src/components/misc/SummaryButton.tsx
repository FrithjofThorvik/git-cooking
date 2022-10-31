import React from "react";

import "./SummaryButton.scss";

export interface ISummaryButtonProps {
    text: string;
    onClick: () => void;
    type: 'default' | 'green';
}

const SummaryButton: React.FC<ISummaryButtonProps> = ({ text, onClick, type = 'default' }): JSX.Element => {
    return (
        <button className={"summary-button" + type} onClick={onClick}>
            {text}
        </button>
    );
};

export default SummaryButton;

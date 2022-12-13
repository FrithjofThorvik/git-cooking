import React from "react";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";

import HighlightText from "./HighlightText";

import "./InfoText.scss";

interface IInfoTextProps {
  text: string;
}

const InfoText: React.FC<IInfoTextProps> = ({ text }): JSX.Element => {
  return (
    <div className="info-text">
      <InfoTwoToneIcon className="info-text-icon" />
      <HighlightText text={text} />
    </div>
  );
};

export default InfoText;

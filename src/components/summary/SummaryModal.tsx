import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import GlassContainer from "../GlassContainer";

import "./SummaryModal.scss";

export interface ISummaryModalProps {
  title: string;
  textLines: { text: string; value: number }[];
}

const SummaryModal: React.FC<ISummaryModalProps> = ({
  title,
  textLines,
}): JSX.Element => {
  const endText = textLines.slice(-1).pop();
  let endTextColor = "color-default";
  if (endText && endText?.value < 0) endTextColor = "color-negative";

  return (
    <div className="summary-modal">
      <GlassContainer triangle={false} border>
        <div className="summary-modal-content">
          <div className="summary-modal-content-top">
            <div className="summary-modal-content-top-title">{title}</div>
            <div className="summary-modal-content-top-text">
              {textLines.slice(0, -1).map((textLine, index) => {
                let color = "color-default";
                if (textLine?.value < 0) color = "color-negative";

                return (
                  <div
                    className="summary-modal-content-top-text-line"
                    key={index}
                  >
                    <p>{textLine?.text}</p>
                    <p className={color}>
                      {textLine?.value} <PaidOutlinedIcon />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="summary-modal-content-bottom">
            <p>{endText?.text}</p>
            <p className={endTextColor}>
              {endText?.value} <PaidOutlinedIcon />
            </p>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default SummaryModal;

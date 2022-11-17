import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import GlassContainer from "components/GlassContainer";

import "./SummaryModal.scss";

export interface ISummaryModalProps {
  day: number;
  cost: number;
  revenue: number;
}

const SummaryModal: React.FC<ISummaryModalProps> = ({
  day,
  cost,
  revenue,
}): JSX.Element => {
  return (
    <div className="summary-modal">
      <GlassContainer triangle={false} border>
        <div className="summary-modal-content">
          <div className="summary-modal-content-top">
            <div className="summary-modal-content-top-title">{`Day ${day}`}</div>
            <div className="summary-modal-content-top-text">
              <div className="summary-modal-content-top-text-line">
                <p>Revenue: </p>
                <p className="color-default">
                  {revenue} <PaidOutlinedIcon />
                </p>
              </div>
              <div className="summary-modal-content-top-text-line">
                <p>Cost: </p>
                <p className="color-negative">
                  {cost} <PaidOutlinedIcon />
                </p>
              </div>
            </div>
          </div>
          <div className="summary-modal-content-bottom">
            <p>Profit: </p>
            <p
              className={`${
                revenue - cost > 0 ? "color-default" : "color-negative"
              }`}
            >
              {revenue - cost} <PaidOutlinedIcon />
            </p>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default SummaryModal;

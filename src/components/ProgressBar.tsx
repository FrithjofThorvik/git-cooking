import React from "react";

import "./ProgressBar.scss";

interface IProgressBarProps {
  percent: number;
  color?: string;
}

const ProgressBar: React.FC<IProgressBarProps> = ({
  percent,
  color,
}): JSX.Element => {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-percent"
        style={{
          width: `${percent}%`,
          backgroundColor: `${color}`,
          boxShadow: `0 0 2px 0 ${color}`,
        }}
      />
    </div>
  );
};

export default ProgressBar;

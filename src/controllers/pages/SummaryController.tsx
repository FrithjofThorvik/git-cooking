import React from "react";

import "./SummaryController.scss";

interface ISummaryControllerProps {}

const SummaryController: React.FC<
  ISummaryControllerProps
> = (): JSX.Element => {
  return <div className="summary"></div>;
};

export default SummaryController;

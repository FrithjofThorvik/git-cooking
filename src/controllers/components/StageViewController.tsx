import React from "react";

import StageView from "../../components/stageView/StageView";

interface IStageViewControllerProps {}

const StageViewController: React.FC<
  IStageViewControllerProps
> = (): JSX.Element => {
  return <StageView />;
};

export default StageViewController;

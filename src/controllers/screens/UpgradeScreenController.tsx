import React from "react";

import { upgrades } from "data/upgrades";
import UpgradeScreen from "components/screens/UpgradeScreen";

interface IUpgradeScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const UpgradeScreenController: React.FC<IUpgradeScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  return (
    <UpgradeScreen
      goNext={goNext}
      goBack={goBack}
      upgrades={upgrades}
      purchaseUpgrade={(itemId: number) => alert(itemId)}
    />
  );
};

export default UpgradeScreenController;

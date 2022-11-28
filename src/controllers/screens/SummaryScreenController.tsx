import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import SummaryScreen from "components/screens/SummaryScreen";

interface ISummaryScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const SummaryScreenController: React.FC<ISummaryScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const [revenue, setRevenue] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const gameData = useGameData();

  useEffect(() => {
    const { revenue, cost } = calculateRevenueAndCost(gameData);
    setRevenue(revenue);
    setCost(cost);
  }, []);

  return (
    <SummaryScreen
      cost={cost}
      revenue={revenue}
      day={gameData.day}
      goNext={goNext}
      goBack={goBack}
    />
  );
};

export default SummaryScreenController;

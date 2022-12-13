import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import { ISummaryStats } from "types/interfaces";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import SummaryScreen from "components/screens/SummaryScreen";

interface ISummaryScreenControllerProps {
  goNext: () => void;
}

const SummaryScreenController: React.FC<ISummaryScreenControllerProps> = ({
  goNext,
}): JSX.Element => {
  const gameData = useGameData();
  const [summaryStats, setSummaryStats] = useState<ISummaryStats | null>(null);

  useEffect(() => {
    const summaryStats = calculateRevenueAndCost(gameData);
    setSummaryStats(summaryStats);
  }, []);

  if (!summaryStats) return <></>;
  return (
    <SummaryScreen
      day={gameData.states.day}
      summaryStats={summaryStats}
      goNext={goNext}
    />
  );
};

export default SummaryScreenController;

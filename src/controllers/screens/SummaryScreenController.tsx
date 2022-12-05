import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import { ISummaryStats } from "types/interfaces";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import SummaryScreen from "components/screens/SummaryScreen";

interface ISummaryScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
  openHelpScreen: () => void;
}

const SummaryScreenController: React.FC<ISummaryScreenControllerProps> = ({
  goNext,
  goBack,
  openHelpScreen,
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
      day={gameData.day}
      summaryStats={summaryStats}
      goNext={goNext}
      goBack={goBack}
      openHelpScreen={openHelpScreen}
    />
  );
};

export default SummaryScreenController;

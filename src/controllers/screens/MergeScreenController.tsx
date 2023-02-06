import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import MergeScreen from "components/screens/MergeScreen";
import { ISummaryStats } from "types/interfaces";
import { calculateRevenueAndCost } from "services/gameDataHelper";

interface IMergeScreenControllerProps {}

const MergeScreenController: React.FC<
  IMergeScreenControllerProps
> = ({}): JSX.Element => {
  const gameData = useGameData();
  const [summaryStats, setSummaryStats] = useState<ISummaryStats | null>(null);

  useEffect(() => {
    const summaryStats = calculateRevenueAndCost(gameData);
    setSummaryStats(summaryStats);
  }, []);

  if (!summaryStats) return <></>;
  return <MergeScreen summaryStats={summaryStats} />;
};

export default MergeScreenController;

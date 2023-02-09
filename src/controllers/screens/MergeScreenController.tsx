import React, { useEffect, useState } from "react";

import { setGameData, useGameData } from "hooks/useGameData";
import MergeScreen from "components/screens/MergeScreen";
import { ISummaryStats } from "types/interfaces";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { copyObjectWithoutRef } from "services/helpers";
import { IGitCooking } from "types/gameDataInterfaces";

interface IMergeScreenControllerProps {
  goNext: () => void;
}

const MergeScreenController: React.FC<IMergeScreenControllerProps> = ({
  goNext,
}): JSX.Element => {
  const gameData = useGameData();
  const [summaryStats, setSummaryStats] = useState<ISummaryStats | null>(null);

  useEffect(() => {
    const activeRemote = gameData.git.getActiveProject()?.remote;
    if (!activeRemote) return;
    const summaryStats = calculateRevenueAndCost(
      gameData,
      activeRemote.branches
    );
    setSummaryStats(summaryStats);
  }, []);

  const merge = (mainBranch: string, branch: string) => {
    const copyGameData: IGitCooking = copyObjectWithoutRef(gameData);
    const activeProjectIndex = copyGameData.git.projects.findIndex(
      (p) => p.active
    );
    if (activeProjectIndex === -1) return null;

    const currentbranch =
      copyGameData.git.projects[activeProjectIndex].remote.getBranch(
        mainBranch
      );
    const targetbranch =
      copyGameData.git.projects[activeProjectIndex].remote.getBranch(branch);

    if (!currentbranch || !targetbranch) return null;

    const updatedRemote = copyGameData.git.projects[
      activeProjectIndex
    ].remote.mergeBranches(currentbranch, targetbranch, copyGameData);
    copyGameData.git.projects[activeProjectIndex].remote = updatedRemote;

    const summaryStats = calculateRevenueAndCost(
      copyGameData,
      updatedRemote.branches
    );
    setSummaryStats(summaryStats);
    setGameData({ ...copyGameData });
  };

  const completeMerge = () => {
    const copyGameData: IGitCooking = copyObjectWithoutRef(gameData);
    copyGameData.states.doneMerging = true;
    setGameData({ ...copyGameData });
  };

  if (!summaryStats) return <></>;
  return (
    <MergeScreen
      summaryStats={summaryStats}
      states={gameData.states}
      merge={merge}
      goNext={goNext}
      completeMerge={completeMerge}
    />
  );
};

export default MergeScreenController;

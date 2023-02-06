import React from "react";

import { IMasterBranch } from "components/screens/MergeScreen";
import { ISummaryBranch, ISummaryStats } from "types/interfaces";
import MergeStat from "./MergeStat";

import "./MergeBranch.scss";

interface IMergeBranchProps {
  branch: IMasterBranch | ISummaryBranch | null;
  summaryStats: ISummaryStats;
}

const MergeBranch: React.FC<IMergeBranchProps> = ({
  branch,
  summaryStats,
}): JSX.Element => {
  return (
    <div className="merge-branch">
      {branch ? (
        <>
          <div className="merge-branch-name">{branch.name}</div>
          <MergeStat
            text="Profit: "
            value={branch.stats.profit}
            maxValue={branch.stats.maxProfit}
          />
          <MergeStat
            text="Items made: "
            value={branch.stats.itemsMadeCount}
            maxValue={branch.stats.itemCount}
          />
          <MergeStat
            text="Orders completed: "
            value={branch.stats.ordersCompleted}
            maxValue={branch.stats.orderCount}
          />
        </>
      ) : (
        <div className="merge-branch-pending">
          <div className="merge-branch-pending-title">Awaiting merge...</div>
          {summaryStats.branches.map((b, i) => (
            <div className="merge-branch-pending-branch" key={i}>
              {b.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergeBranch;

import React from "react";

import { ISummaryBranch, ISummaryStats } from "types/interfaces";
import MergeStat from "./MergeStat";

import "./MergeBranch.scss";

interface IMergeBranchProps {
  branch: ISummaryBranch | null;
  summaryStats: ISummaryStats;
  isMerging?: boolean;
}

const MergeBranch: React.FC<IMergeBranchProps> = ({
  branch,
  summaryStats,
  isMerging = false,
}): JSX.Element => {
  return (
    <div className="merge-branch">
      {branch && isMerging ? (
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
          <div className="merge-branch-pending-title">
            {branch?.isMain ? "Receving Branch" : "Target Branches"}
          </div>
          {summaryStats.branches
            .filter((b) => {
              if (branch?.isMain) return b.isMain;
              return !b.isMain;
            })
            .map((b, i) => (
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

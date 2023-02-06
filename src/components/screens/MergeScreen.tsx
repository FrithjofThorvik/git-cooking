import { Dna } from "react-loader-spinner";
import React, { useState } from "react";

import { imgChef } from "assets";
import { ISummaryBranch, ISummaryStats } from "types/interfaces";
import MenuButton from "components/MenuButton";
import Background from "components/Background";
import MergeBranch from "components/merge/MergeBranch";
import HighlightText from "components/HighlightText";

import "./MergeScreen.scss";

export interface IMasterBranch {
  name: string;
  stats: {
    profit: number;
    maxProfit: number;
    itemsMadeCount: number;
    itemCount: number;
    ordersCompleted: number;
    orderCount: number;
  };
}

const defaultMasterBranch: IMasterBranch = {
  name: "master",
  stats: {
    profit: 0,
    maxProfit: 0,
    itemsMadeCount: 0,
    itemCount: 0,
    ordersCompleted: 0,
    orderCount: 0,
  },
};

interface IMergeScreenProps {
  summaryStats: ISummaryStats;
}

const MergeScreen: React.FC<IMergeScreenProps> = ({
  summaryStats,
}): JSX.Element => {
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [activeBranch, setActiveBranch] = useState<ISummaryBranch | null>(null);
  const [masterBranch, setMasterBranch] =
    useState<IMasterBranch>(defaultMasterBranch);
  const [text, setText] = useState<string>("Awaiting merge...");

  const updateMasterBranch = (
    masterBranch: IMasterBranch,
    branch: ISummaryBranch
  ) => {
    let mBranch = masterBranch;
    mBranch.stats.profit += branch.stats.profit;
    mBranch.stats.maxProfit += branch.stats.maxProfit;
    mBranch.stats.itemsMadeCount += branch.stats.itemsMadeCount;
    mBranch.stats.itemCount += branch.stats.itemCount;
    mBranch.stats.ordersCompleted += branch.stats.ordersCompleted;
    mBranch.stats.orderCount += branch.stats.orderCount;
    return mBranch;
  };

  const startMerge = () => {
    let branchIdx = 0;
    let mBranch = defaultMasterBranch;
    setMasterBranch(mBranch);
    setIsMerging(true);
    setText("Preparing to merge...");

    const interval = setInterval(() => {
      if (branchIdx === summaryStats.branches.length) {
        setActiveBranch(null);
        setIsMerging(false);
        setText("");
        clearInterval(interval);
      } else {
        const branch = summaryStats.branches[branchIdx];
        setActiveBranch(branch);
        mBranch = updateMasterBranch(mBranch, branch);
        setMasterBranch(mBranch);
        setText(
          `Merging %${branch?.name}% branch into %${mBranch.name}% branch`
        );
        branchIdx += 1;
      }
    }, 3000);
  };

  return (
    <Background>
      <div className="merge-screen">
        <div className="merge-screen-day">
          <h1>{`Day 1`}</h1>
        </div>
        <div className="merge-screen-modal">
          <div className="merge-screen-modal-left">
            <MergeBranch branch={activeBranch} summaryStats={summaryStats} />
          </div>
          <div className="merge-screen-modal-middle">
            <div className="merge-screen-modal-middle-loading">
              <img src={imgChef} alt="Chef" />
              {isMerging && (
                <Dna
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                />
              )}
            </div>
            <div className="merge-screen-modal-middle-text">
              <HighlightText text={text} />
            </div>
          </div>
          <div className="merge-screen-modal-right">
            <MergeBranch branch={masterBranch} summaryStats={summaryStats} />
          </div>
        </div>

        <div className="merge-screen-buttons">
          {!isMerging && (
            <div className="merge-screen-buttons-next-button">
              <MenuButton onClick={() => startMerge()} text="Merge" />
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default MergeScreen;

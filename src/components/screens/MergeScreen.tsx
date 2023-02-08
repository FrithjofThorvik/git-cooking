import {
  Dna,
  TailSpin,
} from "react-loader-spinner";
import React, { useEffect, useState } from "react";

import { imgChef } from "assets";
import { ISummaryBranch, ISummaryStats } from "types/interfaces";
import MenuButton from "components/MenuButton";
import Background from "components/Background";
import MergeBranch from "components/merge/MergeBranch";
import HighlightText from "components/HighlightText";

import "./MergeScreen.scss";
import { useInterval } from "hooks/useInterval";

interface IMergeScreenProps {
  summaryStats: ISummaryStats;
  doneMerging: boolean;
  merge: (mainBranch: string, branch: string) => void;
  goNext: () => void;
  completeMerge: () => void;
}

const MergeScreen: React.FC<IMergeScreenProps> = ({
  summaryStats,
  doneMerging,
  merge,
  goNext,
  completeMerge,
}): JSX.Element => {
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [branchIdx, setBranchIdx] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [activeBranch, setActiveBranch] = useState<ISummaryBranch | null>(null);
  const [mainBranch, setMainBranch] = useState<ISummaryBranch | null>(
    summaryStats.branches.find((b) => b.isMain) || null
  );
  const [text, setText] = useState<string>("Awaiting merge...");
  useInterval(() => {
    if (isMerging) {
      let mBranch = summaryStats.branches.find((b) => b.isMain) || null;
      setMainBranch(mBranch);
      setText("Preparing to merge...");
      const branchesToMerge = summaryStats.branches.filter((b) => !b.isMain);
      if (branchIdx === branchesToMerge.length) {
        setIsComplete(true);
        setIsMerging(false);
        setText("%DONE!%");
      } else {
        const branch = branchesToMerge[branchIdx];
        setActiveBranch(branch);
        mBranch && merge(mBranch.name, branch.name);
        mBranch &&
          setText(
            `Merging %${branch?.name}% branch into %${mBranch.name}% branch`
          );
        setBranchIdx((prev) => prev + 1);
      }
    }
  }, 2000);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (isComplete) {
      timeId = setTimeout(() => {
        completeMerge();
      }, 3000);
    }

    return () => {
      if (timeId) clearTimeout(timeId);
    };
  }, [isComplete]);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (doneMerging) {
      timeId = setTimeout(() => {
        goNext();
      }, 3000);
    }

    return () => {
      if (timeId) clearTimeout(timeId);
    };
  }, [doneMerging]);

  if (doneMerging)
    return (
      <Background>
        <div className="merge-screen">
          <div className="merge-screen-to-summary">
            <TailSpin
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <HighlightText text={`Creating %summary%, please wait...`} />
          </div>
        </div>
      </Background>
    );

  return (
    <Background>
      <div className="merge-screen">
        <div className="merge-screen-day">
          <h1>{`Day 1`}</h1>
        </div>
        <div className="merge-screen-modal">
          <div className="merge-screen-modal-left">
            <MergeBranch
              branch={activeBranch}
              summaryStats={summaryStats}
              isMerging={isMerging || isComplete}
            />
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
            <MergeBranch
              branch={mainBranch}
              summaryStats={summaryStats}
              isMerging={isMerging || isComplete}
            />
          </div>
        </div>
        <div className="merge-screen-buttons">
          {!isMerging && !isComplete && (
            <div className="merge-screen-buttons-next-button">
              <MenuButton onClick={() => setIsMerging(true)} text="Merge" />
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default MergeScreen;

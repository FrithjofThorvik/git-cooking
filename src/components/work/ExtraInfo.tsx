import React from "react";

import "./ExtraInfo.scss";
import { IBranch, ICommit } from "types/gitInterfaces";

interface IExtraInfoProps {
  commits: ICommit[];
  unSynced: boolean;
  branch: IBranch | undefined;
}
const ExtraInfo: React.FC<IExtraInfoProps> = ({
  commits,
  unSynced,
  branch,
}): JSX.Element => {
  return (
    <div className="extra-info">
      <div className="extra-info-content">
        <div className="extra-info-content-commits">
          {`${commits.length} commit${commits.length > 1 ? "s" : ""}`}
        </div>
        <div className="extra-info-content-branch">
          <div
            className={`extra-info-content-branch-sync ${
              unSynced ? "unsynced" : ""
            }`}
          >
            {unSynced ? "Unsynced changes" : "Everything up to date"}
          </div>
          <div className="extra-info-content-branch-name">{`On branch ${branch?.name}`}</div>
        </div>
      </div>
    </div>
  );
};

export default ExtraInfo;

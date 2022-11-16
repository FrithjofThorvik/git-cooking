import { IDirectory, IOrderItem, Item } from "./gameDataInterfaces";

export interface IHead {
  targetId: string;
}

export interface IBranch {
  name: string;
  targetCommitId: string;
}

export interface ICommit {
  id: string;
  root?: boolean;
  parents: string[];
  message: string;
  directory: IDirectory;
}

export interface IGitTree {
  HEAD: IHead;
  commits: ICommit[];
  branches: IBranch[];
  stagedItems: Item[];
  modifiedItems: Item[];
  workingDirectory: IDirectory;
  branchIsActive: (branchName: string) => boolean;
  getCommitFromId: (commitId: string) => ICommit | undefined;
  getCommitHistory: () => ICommit[];
  getHeadCommit: () => ICommit | undefined;
  branchNameExists: (branchName: string) => boolean;
  getBranch: (branchName: string) => IBranch | null;
  getModifiedFile: (path: string) => Item | null;
  isItemModified: (orderItem: IOrderItem) => boolean;
  addStagedOnPrevDirectory: (prevDirectory: IDirectory) => IDirectory;
  getNewCommit: (commitMessage: string) => ICommit;
  getGitTreeWithNewCommit: (commitMessage: string) => IGitTree;
  getGitTreeWithSwitchedBranch: (branchName: string) => IGitTree;
  updateExistingOrAddNew: (modifiedItem: Item, newArray: Item[]) => Item[];
}

import { IDirectory, IOrderItem } from "./gameDataInterfaces";

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

export interface IModifiedItem {
  item: IOrderItem;
  added?: boolean;
  deleted?: boolean;
}

export interface IGitTree {
  HEAD: IHead;
  commits: ICommit[];
  branches: IBranch[];
  stagedItems: IModifiedItem[];
  modifiedItems: IModifiedItem[];
  workingDirectory: IDirectory;
  isBranchActive: (branchName: string) => boolean;
  getCommitFromId: (commitId: string) => ICommit | undefined;
  getCommitHistory: () => ICommit[];
  getHeadCommit: () => ICommit | undefined;
  doesBranchNameExists: (branchName: string) => boolean;
  getBranch: (branchName: string) => IBranch | null;
  getModifiedFile: (path: string) => IModifiedItem | undefined;
  getStagedFile: (path: string) => IModifiedItem | undefined;
  isItemModified: (
    orderItem: IOrderItem,
    deleted: boolean
  ) => {
    modified: boolean;
    added: boolean;
  };
  handleModifyItem: (
    orderItem: IOrderItem,
    deleteItem?: boolean
  ) => IModifiedItem[];
  addStagedOnPrevDirectory: (prevCommitDirectory: IDirectory) => IDirectory;
  commit: (commitMessage: string) => IGitTree;
  switchBranch: (branchName: string) => IGitTree;
  getRestoredFile: (itemToRestore: IOrderItem) => IModifiedItem | undefined;
  addNewBranch: (branchName: string) => IGitTree;
  stageItem: (itemToStage: IModifiedItem) => IGitTree;
  stageAllItems: () => IGitTree;
  restoreAllFiles: () => IGitTree;
  restoreFile: (modifiedItem: IModifiedItem) => IGitTree;
  restoreAllStagedFiles: () => IGitTree;
  restoreStagedFile: (mstagedItem: IModifiedItem) => IGitTree;
}

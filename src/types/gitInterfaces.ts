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

export interface IModifiedItem {
  item: Item;
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
  branchIsActive: (branchName: string) => boolean;
  getCommitFromId: (commitId: string) => ICommit | undefined;
  getCommitHistory: () => ICommit[];
  getHeadCommit: () => ICommit | undefined;
  branchNameExists: (branchName: string) => boolean;
  getBranch: (branchName: string) => IBranch | null;
  getModifiedFile: (path: string) => IModifiedItem | undefined;
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
  addStagedOnPrevDirectory: (prevDirectory: IDirectory) => IDirectory;
  getNewCommit: (commitMessage: string) => ICommit;
  getGitTreeWithNewCommit: (commitMessage: string) => IGitTree;
  getGitTreeWithSwitchedBranch: (branchName: string) => IGitTree;
  getRestoredFile: (itemToRestore: Item) => IModifiedItem | undefined;
  updateExistingOrAddNew: (
    modifiedItem: IModifiedItem,
    newArray: IModifiedItem[]
  ) => IModifiedItem[];
}

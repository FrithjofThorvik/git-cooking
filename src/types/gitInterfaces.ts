import {
  IDirectory,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "./gameDataInterfaces";
import { Difficulty } from "types/enums";

export interface IHead {
  targetId: string;
}

export interface IBranch {
  name: string;
  targetCommitId: string;
  remoteTrackingBranch?: string;
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

export interface IRemoteBranch {
  name: string;
  orders: IOrder[];
  pushedItems: IOrderItem[];
  isFetched: boolean;
  stats: IRemoteBranchStats;
}

export interface IRemoteBranchStats {
  missingIngredients: IIngredient[];
  maxProfit: number;
  orders: IOrder[];
  itemCount: number;
  difficulty: Difficulty;
}

export interface IRemote {
  branches: IRemoteBranch[];
  updateBranchStats: (gameData: IGitCooking) => IRemote;
  pushItems: (
    branchName: string,
    items: IOrderItem[],
    orders: IOrder[]
  ) => IRemote | null;
  getActiveRemoteBranch: (branchName: string) => IRemoteBranch | null;
}

export interface IGitTree {
  HEAD: IHead;
  remote: IRemote;
  commits: ICommit[];
  branches: IBranch[];
  stagedItems: IModifiedItem[];
  modifiedItems: IModifiedItem[];
  workingDirectory: IDirectory;
  isBranchActive: (branchName: string) => boolean;
  getActiveBranch: () => IBranch | undefined;
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
  addNewBranch: (branchName: string, remoteBranchName?: string) => IGitTree;
  stageItem: (itemToStage: IModifiedItem) => IGitTree;
  stageAllItems: () => IGitTree;
  restoreAllFiles: () => IGitTree;
  restoreFile: (modifiedItem: IModifiedItem) => IGitTree;
  restoreAllStagedFiles: () => IGitTree;
  restoreStagedFile: (stagedItem: IModifiedItem) => IGitTree;
  getRemoteBranch: (remoteBranchName: string) => IRemoteBranch | null;
  fetch: () => { updatedGit: IGitTree; newBranches: string[] };
}

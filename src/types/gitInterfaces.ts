import {
  IDirectory,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "./gameDataInterfaces";
import { Difficulty, RemoteType } from "types/enums";

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
  targetCommitId: string;
  isFetched: boolean;
  stats: IRemoteBranchStats;
  isMain?: boolean;
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
  commits: ICommit[];
  isFetched: boolean;
  getCommitHistory: (startCommit: string) => ICommit[];
  mergeBranches: (
    currentBranch: IRemoteBranch,
    targetBranch: IRemoteBranch,
    gameData: IGitCooking
  ) => IRemote;
  getBranchCommit: (branchName: string) => ICommit | null;
  getPushedItems: (branchName: string) => IOrderItem[];
  updateBranchStats: (gameData: IGitCooking) => IRemote;
  pushItems: (
    remoteBranchName: string,
    commitHistory: ICommit[],
    orders: IOrder[]
  ) => IRemote | null;
  getBranch: (branchName: string) => IRemoteBranch | null;
}

export interface IProject {
  remote: IRemote;
  cloned: boolean;
  unlocked: boolean;
  unlockDay: number;
  url: string;
  type: RemoteType;
  active: boolean;
  stats: {
    cashMultiplier: number;
    timeReduction: number;
  };
}

export interface IGitTree {
  HEAD: IHead;
  commits: ICommit[];
  branches: IBranch[];
  stagedItems: IModifiedItem[];
  modifiedItems: IModifiedItem[];
  workingDirectory: IDirectory;
  projects: IProject[];
  getActiveProject: () => IProject | null;
  setActiveProjectRemote: (remote: IRemote) => IProject[];
  cloneProject: (project: IProject) => IGitTree;
  activateProject: (project: IProject) => IGitTree;
  isBranchActive: (branchName: string) => boolean;
  getActiveBranch: () => IBranch | undefined;
  getCommitFromId: (commitId: string) => ICommit | undefined;
  getRootCommit: () => ICommit | undefined;
  getCommitHistory: (startCommitId?: string) => ICommit[];
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

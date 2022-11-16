import { IDirectory, Item } from "./gameDataInterfaces";

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
}

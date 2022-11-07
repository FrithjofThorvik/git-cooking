import { IBranch, ICommit, IDirectory, IFile } from "types/gameDataInterfaces";
import { v4 } from "uuid";

class GitHelper {
  public branchIsActive = (
    branchName: string,
    gitActiveBranch: IBranch,
    branches: IBranch[]
  ): boolean => {
    for (let i = 0; i < branches.length; i++) {
      if (
        branchName === branches[i].name &&
        branchName === gitActiveBranch.name
      )
        return true;
    }
    return false;
  };

  public branchNameExists = (branchName: string, branches: IBranch[]) => {
    for (let i = 0; i < branches.length; i++) {
      if (branchName === branches[i].name) return true;
    }
    return false;
  };

  public getBranch = (
    branchName: string,
    branches: IBranch[]
  ): IBranch | null => {
    let branch: IBranch | null = null;
    for (let i = 0; i < branches.length; i++) {
      let currentBranch = branches[i];
      if (branchName === currentBranch.name) branch = currentBranch;
    }
    return branch;
  };

  public getFileToStage = (
    path: string,
    modifiedFiles: IFile[]
  ): IFile | null => {
    let fileToStage: IFile | null = null;
    for (let i = 0; i < modifiedFiles.length; i++) {
      const file = modifiedFiles[i];
      if (file.path === path) fileToStage = file;
    }
    return fileToStage;
  };

  public getUpdatedBranches = (
    activeBranch: IBranch,
    branches: IBranch[],
    currentDirectory: IDirectory,
    commitMessage: string
  ) => {
    const prevCommits = activeBranch.commits;
    const commit: ICommit = {
      id: v4(),
      message: commitMessage,
      branch: activeBranch,
      parent: prevCommits[prevCommits.length - 1],
      child: null,
    };

    const newCommits = activeBranch.commits.concat([commit]);
    const updatedActiveBranch = {
      ...activeBranch,
      directory: currentDirectory,
      commits: newCommits,
    };
    let updatedBranches = branches;
    for (let i = 0; i < updatedBranches.length; i++) {
      if (updatedBranches[i].name === activeBranch.name) {
        updatedBranches[i] = updatedActiveBranch;
      }
    }
    return { updatedActiveBranch, updatedBranches };
  };
}

export const gitHelper = new GitHelper();
function uuidv4(): string {
  throw new Error("Function not implemented.");
}

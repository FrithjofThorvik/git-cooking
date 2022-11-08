import { IBranch, ICommit, IDirectory, Item } from "types/gameDataInterfaces";
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

  public getModifiedFile = (
    path: string,
    modifiedItems: Item[]
  ): Item | null => {
    let itemToStage: Item | null = null;
    for (let i = 0; i < modifiedItems.length; i++) {
      const item = modifiedItems[i];
      if (item.path === path) itemToStage = item;
    }
    return itemToStage;
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

  public updateExistingOrAddNew = (modifiedItem: Item, newArray: Item[]) => {
    const indexInStaged = newArray.findIndex(
      (s) => s.path === modifiedItem.path
    );

    // if modified item is in array
    if (indexInStaged != -1) {
      // update item
      newArray[indexInStaged] = modifiedItem;
    } else {
      // add item
      newArray.push(modifiedItem);
    }
  };
}

export const gitHelper = new GitHelper();

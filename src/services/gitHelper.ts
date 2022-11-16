import { IDirectory, Item, IOrderItem } from "types/gameDataInterfaces";
import { IBranch, ICommit, IGitTree, IHead } from "types/gitInterfaces";
import { v4 } from "uuid";
import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "./gameDataHelper";
import { copyObjectWithoutRef, isOrderItem, objectsEqual } from "./helpers";

class GitHelper {
  public branchIsActive = (branchName: string, head: IHead): boolean => {
    if (typeof head.targetId === "string") return head.targetId === branchName;
    return false;
  };

  public getCommitFromId = (commitId: string, commits: ICommit[]) =>
    commits.find((c) => c.id === commitId);

  public getCommitHistory = (git: IGitTree): ICommit[] => {
    // Implements Breadth First Search
    let queue = [];
    let visited: ICommit[] = [];

    const lastCommitId = this.getHeadCommitId(git.HEAD, git.branches);
    const startCommit = this.getCommitFromId(lastCommitId, git.commits);

    if (startCommit === undefined) return [];
    queue.push(startCommit);
    visited.push(startCommit);

    while (queue.length > 0) {
      let visit = queue.shift();
      visit?.parents.forEach((parent) => {
        const currentCommit = this.getCommitFromId(parent, git.commits);
        if (currentCommit != undefined && !visited.includes(currentCommit)) {
          queue.push(currentCommit);
          visited.push(currentCommit);
        }
      });
    }

    return visited.reverse();
  };

  public getHeadCommitId = (head: IHead, branches: IBranch[]): string => {
    const activeBranch = this.getBranch(head.targetId, branches);
    if (activeBranch != null) {
      return activeBranch.targetCommitId;
    }
    return head.targetId;
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

  public isItemModified = (orderItem: IOrderItem, git: IGitTree): boolean => {
    let isItemModified = false;
    const parentCommitId = this.getHeadCommitId(git.HEAD, git.branches);
    const parentCommit = this.getCommitFromId(parentCommitId, git.commits);
    const prevDirectory = parentCommit?.directory;

    if (prevDirectory) {
      const order = getOrderFromOrderItem(prevDirectory.orders, orderItem);
      if (!order) return true;
      const indexOfOrder = getIndexOfOrder(prevDirectory.orders, order);
      const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

      let prevItem = prevDirectory.orders[indexOfOrder].items[indexOfOrderItem];
      isItemModified = !objectsEqual(prevItem, orderItem);
    }

    return isItemModified;
  };

  public addStagedOnPrevDirectory = (
    prevDirectory: IDirectory,
    workingDirectory: IDirectory,
    stagedItems: Item[]
  ): IDirectory => {
    let newDirectory: IDirectory = copyObjectWithoutRef(prevDirectory);
    const safeCopyWorkingDirectory: IDirectory =
      copyObjectWithoutRef(workingDirectory);

    stagedItems.forEach((item) => {
      if (isOrderItem(item)) {
        let relatedOrderIndex = newDirectory.orders.findIndex(
          (o) => o.id === item.orderId
        );

        // if order did not exist -> add it to new directory from working directory
        if (relatedOrderIndex === -1) {
          let newRelatedOrder = safeCopyWorkingDirectory.orders.find(
            (o) => o.id === item.orderId
          );

          if (newRelatedOrder) {
            newRelatedOrder.items = [item];
            newDirectory.orders.push(newRelatedOrder);
            relatedOrderIndex = newDirectory.orders.findIndex(
              (o) => o.id === newRelatedOrder?.id
            );
          }
        }

        const prevItemIndex = newDirectory.orders[
          relatedOrderIndex
        ].items.findIndex((i) => i.id === item.id);

        if (prevItemIndex === -1) {
          // add the item to new directory
          newDirectory.orders[relatedOrderIndex].items.push(item);
        } else {
          // update the item
          newDirectory.orders[relatedOrderIndex].items[prevItemIndex] = item;
        }
      } else {
        // TODO: Add staged ingredients
      }
    });

    return newDirectory;
  };

  public getNewCommit = (git: IGitTree, commitMessage: string): ICommit => {
    const parentCommitId = this.getHeadCommitId(git.HEAD, git.branches);
    const parentCommit = this.getCommitFromId(parentCommitId, git.commits);

    let newCommit: ICommit = {
      id: v4(),
      message: commitMessage,
      parents: [parentCommitId],
      directory: git.workingDirectory,
    };

    const prevDirectory = copyObjectWithoutRef(parentCommit?.directory);

    if (prevDirectory) {
      // Update directory with staged files
      newCommit.directory = this.addStagedOnPrevDirectory(
        prevDirectory,
        git.workingDirectory,
        git.stagedItems
      );
    }

    return newCommit;
  };

  public updateGitTreeWithNewCommit = (
    git: IGitTree,
    commitMessage: string
  ) => {
    const newCommit = this.getNewCommit(git, commitMessage);
    let copyGit: IGitTree = copyObjectWithoutRef(git);

    // add new commit
    copyGit.commits.push(newCommit);

    // update head pointer to point at new commit
    let activeBranch = this.getBranch(git.HEAD.targetId, copyGit.branches);
    if (activeBranch != null) {
      const activeBranchName = activeBranch.name;
      const indexOfActiveBranch = copyGit.branches.findIndex(
        (b) => b.name === activeBranchName
      );
      copyGit.branches[indexOfActiveBranch].targetCommitId = newCommit.id;
    } else {
      git.HEAD.targetId = newCommit.id;
    }

    // clear staged items
    copyGit.stagedItems = [];

    return copyGit;
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

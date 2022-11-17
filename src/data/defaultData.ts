import { v4 } from "uuid";

import {
  isOrderItem,
  objectsEqual,
  copyObjectWithoutRef,
} from "services/helpers";
import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "services/gameDataHelper";
import {
  Item,
  IFries,
  IBurger,
  IOrderItem,
  IDirectory,
  IGitCooking,
} from "types/gameDataInterfaces";
import { upgrades } from "./upgrades";
import { foodItems } from "./ingredients";
import { foodBuilder } from "services/foodBuilders";
import { GameState, IngredientType } from "types/enums";
import { IBranch, ICommit, IGitTree } from "types/gitInterfaces";

export const defaultDirectory: IDirectory = {
  orders: [],
  foods: [
    {
      id: "1",
      name: "Burger",
      type: IngredientType.BURGER,
      unlocked: true,
      ingredients: copyObjectWithoutRef(foodItems.burger),
      builder: (ingredients) => foodBuilder.buildBurger(ingredients as IBurger),
    },
    {
      id: "2",
      name: "Fries",
      unlocked: true,
      type: IngredientType.EXTRA,
      ingredients: copyObjectWithoutRef(foodItems.fries),
      builder: (ingredients) => foodBuilder.buildFries(ingredients as IFries),
    },
  ],
};

const defaultCommit: ICommit = {
  id: v4(),
  root: true,
  parents: [],
  message: "root commit",
  directory: copyObjectWithoutRef(defaultDirectory),
};

export const defaultGit: IGitTree = {
  branches: [
    {
      name: "master",
      targetCommitId: defaultCommit.id,
    },
  ],
  commits: [copyObjectWithoutRef(defaultCommit)],
  HEAD: {
    targetId: "master",
  },
  workingDirectory: copyObjectWithoutRef(defaultDirectory),
  stagedItems: [],
  modifiedItems: [],
  branchIsActive: function (branchName: string) {
    return this.HEAD.targetId === branchName;
  },
  getCommitFromId: function (commitId: string) {
    return this.commits.find((c) => c.id === commitId);
  },
  getCommitHistory: function () {
    // Implements Breadth First Search
    let queue = [];
    let visited: ICommit[] = [];

    const startCommit = this.getHeadCommit();

    if (startCommit === undefined) return [];
    queue.push(startCommit);
    visited.push(startCommit);

    while (queue.length > 0) {
      let visit = queue.shift();
      visit?.parents.forEach((parent) => {
        const currentCommit = this.getCommitFromId(parent);
        if (currentCommit != undefined && !visited.includes(currentCommit)) {
          queue.push(currentCommit);
          visited.push(currentCommit);
        }
      });
    }

    return visited.reverse();
  },
  getHeadCommit: function () {
    const activeBranch = this.getBranch(this.HEAD.targetId);
    if (activeBranch != null) {
      return this.getCommitFromId(activeBranch.targetCommitId);
    }
    return this.getCommitFromId(this.HEAD.targetId);
  },
  branchNameExists: function (branchName: string) {
    for (let i = 0; i < this.branches.length; i++) {
      if (branchName === this.branches[i].name) return true;
    }
    return false;
  },
  getBranch: function (branchName: string) {
    let branch: IBranch | null = null;
    for (let i = 0; i < this.branches.length; i++) {
      let currentBranch = this.branches[i];
      if (branchName === currentBranch.name) branch = currentBranch;
    }
    return branch;
  },
  getModifiedFile: function (path: string) {
    let itemToStage: Item | null = null;
    for (let i = 0; i < this.modifiedItems.length; i++) {
      const item = this.modifiedItems[i];
      if (item.path === path) itemToStage = item;
    }
    return itemToStage;
  },
  isItemModified: function (orderItem: IOrderItem) {
    let isItemModified = false;
    const parentCommit = this.getHeadCommit();
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
  },
  addStagedOnPrevDirectory: function (prevDirectory: IDirectory) {
    let newDirectory: IDirectory = copyObjectWithoutRef(prevDirectory);
    const safeCopyWorkingDirectory: IDirectory = copyObjectWithoutRef(
      this.workingDirectory
    );

    this.stagedItems.forEach((item) => {
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
  },
  getNewCommit: function (commitMessage: string) {
    const parentCommit = this.getHeadCommit();
    let newCommit: ICommit = {
      id: v4(),
      message: commitMessage,
      parents: [],
      directory: this.workingDirectory,
    };
    if (parentCommit) {
      newCommit.parents = [parentCommit.id];
      const prevDirectory = copyObjectWithoutRef(parentCommit.directory);

      if (prevDirectory) {
        // Update directory with staged files
        newCommit.directory = this.addStagedOnPrevDirectory(prevDirectory);
      }
    }

    return newCommit;
  },
  getGitTreeWithNewCommit: function (commitMessage: string) {
    const newCommit = this.getNewCommit(commitMessage);
    let copyGit: IGitTree = copyObjectWithoutRef(this);

    // add new commit
    copyGit.commits.push(newCommit);

    // update head pointer to point at new commit
    let activeBranch = this.getBranch(copyGit.HEAD.targetId);
    if (activeBranch != null) {
      const activeBranchName = activeBranch.name;
      const indexOfActiveBranch = copyGit.branches.findIndex(
        (b) => b.name === activeBranchName
      );
      copyGit.branches[indexOfActiveBranch].targetCommitId = newCommit.id;
    } else {
      copyGit.HEAD.targetId = newCommit.id;
    }

    // clear staged items
    copyGit.stagedItems = [];

    return copyGit;
  },
  getGitTreeWithSwitchedBranch: function (branchName: string) {
    if (!this.branchNameExists(branchName)) return this;

    let copyGit: IGitTree = copyObjectWithoutRef(this);
    copyGit.HEAD.targetId = branchName;

    // update the working directory
    const newActiveCommit = copyGit.getHeadCommit();
    if (newActiveCommit) copyGit.workingDirectory = newActiveCommit.directory;
    return copyGit;
  },
  updateExistingOrAddNew: function (modifiedItem: Item, newArray: Item[]) {
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
    return newArray;
  },
};

export const defaultGameData: IGitCooking = {
  day: 0,
  cash: 250,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.WORKING,
  upgrades: copyObjectWithoutRef(upgrades),
  git: copyObjectWithoutRef(defaultGit),
  selectedItems: [],
};

export const emptyGameData: IGitCooking = {
  day: 0,
  cash: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  upgrades: [],
  git: copyObjectWithoutRef(defaultGit),
  selectedItems: [],
};

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
import { IBranch, ICommit, IGitTree, IModifiedItem } from "types/gitInterfaces";

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
    for (let i = 0; i < this.modifiedItems.length; i++) {
      const modifiedItem = this.modifiedItems[i];
      if (modifiedItem.item.path === path) return modifiedItem;
    }
  },
  isItemModified: function (orderItem: IOrderItem, deleted = false) {
    let isModified: boolean = false;
    let isAdded: boolean = false;
    const indexInStaged = this.stagedItems.findIndex(
      (s) => s.item.path === orderItem.path
    );

    if (indexInStaged != -1) {
      // compare with staged
      const staged = this.stagedItems[indexInStaged];
      if (staged.deleted && !deleted) {
        isAdded = true;
      } else if (!(staged.deleted && deleted)) {
        isModified = !objectsEqual(staged.item, orderItem);
      }
    } else {
      // compare with past commit
      const parentCommit = this.getHeadCommit();
      const prevDirectory = parentCommit?.directory;

      if (prevDirectory) {
        const order = getOrderFromOrderItem(prevDirectory.orders, orderItem);
        if (!order) isAdded = true;
        else {
          const indexOfOrder = getIndexOfOrder(prevDirectory.orders, order);
          const indexOfOrderItem = getIndexOfOrderItem(order, orderItem);

          if (indexOfOrderItem === -1) isAdded = true;
          let prevItem =
            prevDirectory.orders[indexOfOrder].items[indexOfOrderItem];
          isModified = !objectsEqual(prevItem, orderItem);
        }
      }
    }

    return {
      modified: isModified,
      added: isAdded,
    };
  },
  handleModifyItem: function (orderItem, deleteItem = false) {
    let newModifiedItems = this.modifiedItems;
    const modification = this.isItemModified(orderItem, deleteItem);

    const updateModifiedItem = (added: boolean, deleted: boolean) => {
      const indexInModified = newModifiedItems.findIndex(
        (i) => i.item.path === orderItem.path
      );
      let newItem = {
        item: orderItem,
        added: added,
        deleted: deleted,
      };
      if (deleted && added) {
        newModifiedItems = newModifiedItems.filter(
          (i) => i.item.path !== orderItem.path
        );
      } else if (indexInModified === -1) {
        newModifiedItems = this.modifiedItems.concat([newItem]);
      } else {
        newModifiedItems[indexInModified] = newItem;
      }
    };

    if (modification.modified || modification.added || deleteItem) {
      updateModifiedItem(modification.added, deleteItem);
    } else {
      newModifiedItems = newModifiedItems.filter(
        (i) => i.item.path != orderItem.path
      );
    }
    return newModifiedItems;
  },
  addStagedOnPrevDirectory: function (prevDirectory: IDirectory) {
    let newDirectory: IDirectory = copyObjectWithoutRef(prevDirectory);
    const safeCopyWorkingDirectory: IDirectory = copyObjectWithoutRef(
      this.workingDirectory
    );

    this.stagedItems.forEach((stagedItem) => {
      const item = stagedItem.item;
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
        ].items.findIndex((i) => i.path === item.path);

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
  getRestoredFile: function (itemToRestore: Item) {
    const indexInStaged = this.stagedItems.findIndex(
      (s) => s.item.path === itemToRestore.path
    );

    if (indexInStaged != -1) {
      // restore from staged
      const stagedItem = this.stagedItems[indexInStaged];
      return stagedItem;
    } else {
      // restore from last commit
      const activeCommit = this.getHeadCommit();

      const restoredItem = activeCommit?.directory.orders
        .find((o) => {
          if (isOrderItem(itemToRestore)) return o.id === itemToRestore.orderId;
        })
        ?.items.find((i) => i.path === itemToRestore.path);
      if (restoredItem === undefined) return undefined;
      return { item: restoredItem };
    }
  },
  updateExistingOrAddNew: function (
    modifiedItem: IModifiedItem,
    newArray: IModifiedItem[]
  ) {
    const indexInStaged = newArray.findIndex(
      (s) => s.item.path === modifiedItem.item.path
    );

    // if modified item is in array
    if (indexInStaged != -1) {
      // update item
      if (modifiedItem.deleted)
        newArray = newArray.filter(
          (i) => i.item.path != modifiedItem.item.path
        );
      else newArray[indexInStaged] = modifiedItem;
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

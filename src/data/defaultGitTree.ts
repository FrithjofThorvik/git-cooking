import { v4 } from "uuid";

import {
  getIndexOfOrder,
  getIndexOfOrderItem,
  getOrderFromOrderItem,
} from "services/gameDataHelper";
import {
  IDirectory,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { IngredientType } from "types/enums";
import { copyObjectWithoutRef, objectsEqual } from "services/helpers";
import { IBranch, ICommit, IGitTree, IModifiedItem } from "types/gitInterfaces";

export const defaultDirectory: IDirectory = {
  orders: [],
  createOrderFolder: function (order: IOrder) {
    let copy: IDirectory = copyObjectWithoutRef(this);
    copy.orders.forEach((o) => {
      if (o.id === order.id) {
        o.isCreated = true;
      }
    });
    return copy;
  },
  addOrderItemToOrder: function (order: IOrder, orderItem: IOrderItem) {
    let copy = this;
    copy.orders.forEach((o) => {
      if (o.id === order.id) {
        o.items.push(orderItem);
      }
    });
    return copy;
  },
  deleteOrderItem: function (orderItem: IOrderItem) {
    let copy: IDirectory = copyObjectWithoutRef(this);
    copy.orders.forEach((o) => {
      if (o.id === orderItem.orderId) {
        o.items = o.items.filter((i) => i.path !== orderItem.path);
      }
    });
    return copy;
  },
  modifyOrderItem: function (
    orderItem: IOrderItem,
    data: {
      type?: IngredientType;
      addIngredient?: IIngredient;
      removeIngredientAtIndex?: number;
    },
    modify: (orderItem: IOrderItem) => void
  ) {
    let copy: IDirectory = copyObjectWithoutRef(this);
    copy.orders.forEach((o) => {
      if (o.id === orderItem.orderId) {
        o.items.forEach((i) => {
          if (orderItem.path === i.path) {
            if (data.type) {
              i.type = data.type;
              i.ingredients = [];
            } else if (data.addIngredient) {
              i.ingredients.push(data.addIngredient);
            } else if (data.removeIngredientAtIndex !== undefined) {
              i.ingredients.splice(data.removeIngredientAtIndex, 1);
            }
            modify(i);
          }
        });
      }
    });
    return copy;
  },
};

const defaultCommit: ICommit = {
  id: v4(),
  root: true,
  parents: [],
  message: "root commit",
  directory: copyObjectWithoutRef(defaultDirectory),
};

export const defaultGitTree: IGitTree = {
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
    let newModifiedItems: IModifiedItem[] = copyObjectWithoutRef(
      this.modifiedItems
    );
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
    return copyObjectWithoutRef(newModifiedItems);
  },
  addStagedOnPrevDirectory: function (prevDirectory: IDirectory) {
    let newDirectory: IDirectory = copyObjectWithoutRef(prevDirectory);
    const safeCopyWorkingDirectory: IDirectory = copyObjectWithoutRef(
      this.workingDirectory
    );

    this.stagedItems.forEach((stagedItem) => {
      const item = copyObjectWithoutRef(stagedItem.item);
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
    });

    return newDirectory;
  },
  getNewCommit: function (commitMessage: string) {
    const parentCommit = copyObjectWithoutRef(this.getHeadCommit());
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
    if (newActiveCommit)
      copyGit.workingDirectory = copyObjectWithoutRef(
        newActiveCommit.directory
      );
    return copyGit;
  },
  getRestoredFile: function (itemToRestore: IOrderItem) {
    const indexInStaged = this.stagedItems.findIndex(
      (s) => s.item.path === itemToRestore.path
    );

    if (indexInStaged != -1) {
      // restore from staged
      const stagedItem: IModifiedItem = copyObjectWithoutRef(
        this.stagedItems[indexInStaged]
      );
      return stagedItem;
    } else {
      // restore from last commit
      const activeCommit = this.getHeadCommit();

      const restoredOrderItem: IOrderItem = copyObjectWithoutRef(
        activeCommit?.directory.orders
      )
        .find((o: IOrder) => o.id === itemToRestore.orderId)
        ?.items.find((i: IOrderItem) => i.path === itemToRestore.path);
      if (restoredOrderItem === undefined) return undefined;
      return { item: restoredOrderItem };
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
  getGitTreeWithNewBranch: function (branchName: string) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    const activeCommit = this.getHeadCommit();
    if (activeCommit) {
      const newBranch: IBranch = {
        name: branchName,
        targetCommitId: activeCommit.id,
      };

      // add new branch to gitTree
      copyGit.branches.push(newBranch);

      // switch branch
      copyGit = copyGit.getGitTreeWithSwitchedBranch(newBranch.name);
    }
    return copyGit;
  },
  getGitTreeWithStagedItem: function (itemToStage: IModifiedItem) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    const newStagedItems = this.updateExistingOrAddNew(
      itemToStage,
      copyObjectWithoutRef(this.stagedItems)
    );

    copyGit.stagedItems = copyObjectWithoutRef(newStagedItems);

    const newModifiedItems = this.modifiedItems.filter(
      (modifiedItem: IModifiedItem) =>
        modifiedItem.item.path !== itemToStage.item.path
    );

    copyGit.modifiedItems = copyObjectWithoutRef(newModifiedItems);
    return copyGit;
  },
  getGitTreeWithAllStagedItems: function () {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    this.modifiedItems.forEach((modifiedItem: IModifiedItem) => {
      copyGit = copyGit.getGitTreeWithStagedItem(modifiedItem);
    });
    return copyGit;
  },
  restoreFile: function (modifiedItem: IModifiedItem) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    if (modifiedItem?.added) return copyGit;
    let itemToRestore = modifiedItem.item;

    const restored = copyGit.getRestoredFile(itemToRestore);
    const restoredItem = restored?.item;

    const relatedOrderIndex = copyGit.workingDirectory.orders.findIndex(
      (o) => o.id === itemToRestore.orderId
    );
    if (restoredItem === undefined || restored?.deleted) {
      copyGit.workingDirectory.orders[relatedOrderIndex].items =
        copyGit.workingDirectory.orders[relatedOrderIndex].items.filter(
          (i) => i.path !== itemToRestore.path
        );
    } else {
      if (modifiedItem.deleted) {
        copyGit.workingDirectory.orders[relatedOrderIndex].items =
          copyGit.workingDirectory.orders[relatedOrderIndex].items.concat([
            restoredItem,
          ]);
      } else {
        const itemToRestoreIndex = getIndexOfOrderItem(
          copyGit.workingDirectory.orders[relatedOrderIndex],
          itemToRestore
        );

        copyGit.workingDirectory.orders[relatedOrderIndex].items[
          itemToRestoreIndex
        ] = restoredItem;
      }
    }
    const newModifiedItems = copyGit.modifiedItems.filter(
      (modifiedItem: IModifiedItem) =>
        modifiedItem.item.path !== itemToRestore?.path
    );

    copyGit.modifiedItems = newModifiedItems;
    return copyGit;
  },
  restoreAllFiles: function () {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    copyGit.modifiedItems.forEach((modifiedItem) => {
      copyGit = copyGit.restoreFile(modifiedItem);
    });
    return copyGit;
  },
};

import { v4 } from "uuid";

import {
  IDirectory,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import {
  IBranch,
  ICommit,
  IGitTree,
  IModifiedItem,
  IProject,
  IRemote,
  IRemoteBranch,
} from "types/gitInterfaces";
import { IngredientType, RemoteType } from "types/enums";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { copyObjectWithoutRef, objectsEqual } from "services/helpers";

const defaultRemote: IRemote = {
  branches: [],
  isFetched: false,
  updateBranchStats: function (gameData: IGitCooking) {
    const copyRemote: IRemote = copyObjectWithoutRef(this);
    const copyGameData: IGitCooking = copyObjectWithoutRef(gameData);

    const { branches } = calculateRevenueAndCost(
      copyGameData,
      copyRemote.branches
    );

    copyRemote.branches = copyRemote.branches.map((b) => {
      const copyBranch: IRemoteBranch = copyObjectWithoutRef(b);
      let missingIngredients: IIngredient[] = [];
      let orders: IOrder[] = [];
      let itemCount = 0;

      let maxProfit = branches.find(
        (summaryBranch) => summaryBranch.name === b.name
      )?.stats.maxProfit;

      copyBranch.orders.forEach((o) => {
        orders.push(o);

        o.orderItems.forEach((oi) => {
          itemCount += 1;

          oi.ingredients.forEach((i) => {
            const alreadyAdded = missingIngredients.some(
              (ing) => ing.id === i.id
            );
            const unlockedNotPurchased = i.unlocked && !i.purchased;

            if (!alreadyAdded && unlockedNotPurchased)
              missingIngredients.push(i);
          });
        });
      });
      return {
        ...b,
        stats: {
          ...b.stats,
          itemCount: itemCount,
          missingIngredients: missingIngredients,
          orders: orders,
          maxProfit: maxProfit != undefined ? maxProfit : 0,
        },
      };
    });
    return copyRemote;
  },
  pushItems: function (branchName, items, orders) {
    let copy: IRemote = copyObjectWithoutRef(this);

    const branchIndex = this.branches.findIndex((b) => b.name === branchName);
    if (objectsEqual(items, copy.branches[branchIndex].pushedItems))
      return null;

    if (branchIndex !== -1) {
      copy.branches[branchIndex].pushedItems = items;
      copy.branches[branchIndex].orders = orders;
    }

    return copy;
  },
  getRemoteBranch: function (branchName) {
    let copy: IRemote = copyObjectWithoutRef(this);

    for (let i = 0; i < copy.branches.length; i++) {
      if (copy.branches[i].name === branchName) return copy.branches[i];
    }
    return null;
  },
};

export const defaultDirectory: IDirectory = {
  createdItems: [],
  addOrderItem: function (orderItem: IOrderItem) {
    let copy = this;
    copy.createdItems.push(orderItem);
    return copy;
  },
  deleteOrderItem: function (orderItem: IOrderItem) {
    let copy: IDirectory = copyObjectWithoutRef(this);
    copy.createdItems = copy.createdItems.filter(
      (i) => i.path !== orderItem.path
    );
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
    copy.createdItems.forEach((i) => {
      if (orderItem.path === i.path) {
        if (data.type) {
          i.type = data.type;
          i.ingredients = [];
        } else if (data.addIngredient) {
          if (
            (data.addIngredient.isSingle &&
              orderItem.ingredients.length === 0) ||
            !data.addIngredient.isSingle
          )
            i.ingredients.push(data.addIngredient);
        } else if (data.removeIngredientAtIndex !== undefined) {
          i.ingredients.splice(data.removeIngredientAtIndex, 1);
        }
        modify(i);
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

const defaultProjects: IProject[] = [
  {
    remote: defaultRemote,
    unlocked: true,
    unlockDay: 0,
    cloned: false,
    url: "https://gitcookin.com/colonelsand",
    type: RemoteType.BEGINNER,
    active: true,
    stats: {
      cashMultiplier: 1,
      timeReduction: 1,
    },
  },
  {
    remote: defaultRemote,
    unlocked: false,
    unlockDay: 3,
    cloned: false,
    url: "https://gitcookin.com/jamieolive",
    type: RemoteType.INTERMEDIATE,
    active: false,
    stats: {
      cashMultiplier: 2.25,
      timeReduction: 0.75,
    },
  },
  {
    remote: defaultRemote,
    unlocked: false,
    cloned: false,
    unlockDay: 6,
    url: "https://gitcookin.com/gordonramsdale",
    type: RemoteType.ADVANCED,
    active: false,
    stats: {
      cashMultiplier: 3.5,
      timeReduction: 0.5,
    },
  },
];

export const defaultGitTree: IGitTree = {
  branches: [],
  commits: [copyObjectWithoutRef(defaultCommit)],
  HEAD: {
    targetId: defaultCommit.id,
  },
  workingDirectory: copyObjectWithoutRef(defaultDirectory),
  stagedItems: [],
  modifiedItems: [],
  projects: defaultProjects,
  isBranchActive: function (branchName: string) {
    return this.HEAD.targetId === branchName;
  },
  setActiveProjectRemote: function (remote: IRemote) {
    let updatedProjects: IProject[] = copyObjectWithoutRef(this.projects);
    const activeProjectId = this.projects.findIndex((p) => p.active);
    if (activeProjectId !== -1)
      updatedProjects[activeProjectId].remote = remote;
    return updatedProjects;
  },
  getActiveProject: function () {
    const activeProject = this.projects.find((p) => p.active);
    if (!activeProject) return null;
    return activeProject;
  },
  cloneProject: function (project: IProject) {
    let copy: IGitTree = copyObjectWithoutRef(this);
    if (project.cloned) return copy;

    for (let i = 0; i < copy.projects.length; i++) {
      if (project.type === copy.projects[i].type) {
        copy.projects[i].cloned = true;
        copy.projects[i].active = true;
      } else copy.projects[i].active = false;
    }

    copy = copy.fetch().updatedGit;

    return copy;
  },
  activateProject: function (project: IProject) {
    let copy: IGitTree = copyObjectWithoutRef(this);

    for (let i = 0; i < copy.projects.length; i++) {
      if (project.type === copy.projects[i].type)
        copy.projects[i].active = true;
      else copy.projects[i].active = false;
    }

    return copy;
  },
  getRootCommit: function () {
    return this.commits.find((c) => c.root);
  },
  getActiveBranch: function () {
    return this.branches.find((b) => b.name === this.HEAD.targetId);
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
  doesBranchNameExists: function (branchName: string) {
    for (let i = 0; i < this.branches.length; i++) {
      if (branchName === this.branches[i].name) return true;
    }
    return false;
  },
  getBranch: function (branchName: string) {
    let branch: IBranch | null = null;
    this.branches.forEach((b) => {
      if (branchName === b.name) branch = b;
    });
    return branch;
  },
  getModifiedFile: function (path: string) {
    for (let i = 0; i < this.modifiedItems.length; i++) {
      const modifiedItem = this.modifiedItems[i];
      if (modifiedItem.item.path === path) return modifiedItem;
    }
  },
  getStagedFile: function (path: string) {
    for (let i = 0; i < this.stagedItems.length; i++) {
      const stagedItem = this.stagedItems[i];
      if (stagedItem.item.path === path) return stagedItem;
    }
  },
  isItemModified: function (orderItem: IOrderItem, deleteItem = false) {
    let isModified: boolean = false;
    let isAdded: boolean = false;

    let itemIsInStaged = false;
    this.stagedItems.forEach((staged) => {
      if (staged.item.path === orderItem.path) {
        itemIsInStaged = true;
        if (staged.deleted && !deleteItem) {
          isAdded = true;
        } else if (!(staged.deleted && deleteItem)) {
          isModified = !objectsEqual(staged.item, orderItem);
        }
      }
    });

    if (!itemIsInStaged) {
      isAdded = true; // assumed a new file was added

      // compare with past commit
      const parentCommit = this.getHeadCommit();
      parentCommit?.directory?.createdItems.forEach((i) => {
        if (i.path === orderItem.path) {
          isAdded = false; // the item existed before
          isModified = !objectsEqual(i, orderItem);
        }
      });
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
      let newItem = {
        item: orderItem,
        added: added,
        deleted: deleted,
      };

      let itemInModified = false;
      newModifiedItems.forEach((modifiedItem, index) => {
        if (modifiedItem.item.path === orderItem.path) {
          itemInModified = true;
          // added, or deleted, in modified -> update item
          newModifiedItems[index] = newItem;
        }
      });

      if (!itemInModified) {
        // not in modified -> add to modified
        newModifiedItems = this.modifiedItems.concat([newItem]);
      }
    };

    // if added then deleted -> not modified
    if (
      modification.modified || modification.added ? !deleteItem : deleteItem
    ) {
      updateModifiedItem(modification.added, deleteItem);
    } else {
      newModifiedItems = newModifiedItems.filter(
        (i) => i.item.path != orderItem.path
      );
    }

    return copyObjectWithoutRef(newModifiedItems);
  },
  addStagedOnPrevDirectory: function (prevCommitDirectory: IDirectory) {
    let newCommitDirectory: IDirectory =
      copyObjectWithoutRef(prevCommitDirectory);

    this.stagedItems.forEach((stagedItem) => {
      const item = copyObjectWithoutRef(stagedItem.item);
      let existsInItems = false;
      newCommitDirectory.createdItems.forEach((i, itemIndex) => {
        if (i.path === item.path) {
          existsInItems = true;
          // update the item
          newCommitDirectory.createdItems[itemIndex] = item;
        }
      });

      if (!existsInItems) {
        // add the item to new directory
        newCommitDirectory.createdItems.push(item);
      }
    });

    return newCommitDirectory;
  },
  commit: function (commitMessage: string) {
    const getNewCommit = (commitMessage: string) => {
      const parentCommit: ICommit | undefined = copyObjectWithoutRef(
        this.getHeadCommit()
      );
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
    };

    const newCommit = getNewCommit(commitMessage);
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
  switchBranch: function (branchName: string) {
    if (!this.doesBranchNameExists(branchName)) return this;

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
        activeCommit?.directory.createdItems.find(
          (i: IOrderItem) => i.path === itemToRestore.path
        )
      );
      if (restoredOrderItem === undefined) return undefined;
      return { item: restoredOrderItem };
    }
  },
  addNewBranch: function (branchName: string, remoteBranchName?: string) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    const activeCommit = this.getHeadCommit();
    if (activeCommit) {
      const rootCommit = this.getRootCommit();
      let newBranch: IBranch = {
        name: branchName,
        targetCommitId: remoteBranchName
          ? rootCommit?.id || defaultCommit.id
          : activeCommit.id,
      };

      if (remoteBranchName) newBranch.remoteTrackingBranch = remoteBranchName;

      // add new branch to gitTree
      copyGit.branches.push(newBranch);
    }
    return copyGit;
  },
  stageItem: function (itemToStage: IModifiedItem) {
    const updateExistingOrAddNew = (
      itemToStage: IModifiedItem,
      stagedItems: IModifiedItem[]
    ) => {
      const indexInStaged = stagedItems.findIndex(
        (x) => x.item.path === itemToStage.item.path
      );

      // if itemToStage is in staged
      if (indexInStaged != -1) {
        // update item
        if (itemToStage.deleted) {
          stagedItems = stagedItems.filter(
            (i) => i.item.path != itemToStage.item.path
          );
        } else if (itemToStage.added && stagedItems[indexInStaged].deleted) {
          // if deleted in staged, but added in modified -> modified in staged
          let newItemToStage = itemToStage;
          newItemToStage.added = false;
          newItemToStage.deleted = false;
          stagedItems[indexInStaged] = newItemToStage;
        } else {
          stagedItems[indexInStaged] = itemToStage;
        }
      } else {
        // add item
        stagedItems.push(itemToStage);
      }
      return stagedItems;
    };

    let copyGit: IGitTree = copyObjectWithoutRef(this);
    const newStagedItems = updateExistingOrAddNew(
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
  stageAllItems: function () {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    this.modifiedItems.forEach((modifiedItem: IModifiedItem) => {
      copyGit = copyGit.stageItem(modifiedItem);
    });
    return copyGit;
  },
  restoreFile: function (modifiedItem: IModifiedItem) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    if (modifiedItem?.added) return copyGit;
    let itemToRestore = modifiedItem.item;

    const restored = copyGit.getRestoredFile(itemToRestore);
    const restoredItem = restored?.item;

    // if restored item doesn't exist or is deleted -> remove it
    if (restoredItem === undefined || restored?.deleted) {
      copyGit.workingDirectory.createdItems =
        copyGit.workingDirectory.createdItems.filter(
          (i) => i.path !== itemToRestore.path
        );
    } else {
      if (modifiedItem.deleted) {
        // if itemToRestore deleted -> restore item
        copyGit.workingDirectory.createdItems.push(restoredItem);
      } else {
        // update the item with the restored item
        copyGit.workingDirectory.createdItems.forEach((i, index) => {
          if (i.path === itemToRestore.path)
            copyGit.workingDirectory.createdItems[index] =
              copyObjectWithoutRef(restoredItem);
        });
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
  restoreStagedFile: function (stagedItem: IModifiedItem) {
    let copyGit: IGitTree = copyObjectWithoutRef(this);

    // remove stagedItem from staged
    copyGit.stagedItems = copyGit.stagedItems.filter(
      (i) => i.item.path !== stagedItem.item.path
    );

    // update modified
    let newModifiedItems = copyGit.modifiedItems;
    copyGit.workingDirectory.createdItems.forEach((i) => {
      if (i.path === stagedItem.item.path) {
        newModifiedItems = copyGit.handleModifyItem(i);
      }
    });
    copyGit.modifiedItems = newModifiedItems;

    return copyGit;
  },
  restoreAllStagedFiles: function () {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    copyGit.stagedItems.forEach((stagedItem) => {
      copyGit = copyGit.restoreStagedFile(stagedItem);
    });
    return copyGit;
  },
  getRemoteBranch: function (remoteBranchName: string) {
    let remoteBranch: IRemoteBranch | null = null;
    this.getActiveProject()?.remote.branches.forEach((branch) => {
      if (remoteBranchName === branch.name) remoteBranch = branch;
    });
    return remoteBranch;
  },
  fetch: function () {
    let copyGit: IGitTree = copyObjectWithoutRef(this);
    let updatedRemote: IRemote = copyObjectWithoutRef(
      copyGit.getActiveProject()?.remote
    );
    let newBranches: string[] = [];

    const updatedBranches = updatedRemote.branches.map((b) => {
      if (!b.isFetched) {
        b.isFetched = true;
        newBranches.push(b.name);
      }
      return b;
    });
    if (updatedBranches) {
      updatedRemote.branches = updatedBranches;
      copyGit.projects = copyGit.setActiveProjectRemote(updatedRemote);
    }

    return { updatedGit: copyGit, newBranches: newBranches };
  },
};

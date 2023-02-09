import { IGitTree, IProject, IRemoteBranch } from "types/gitInterfaces";
import { Difficulty, GameState } from "types/enums";
import { defaultHelp } from "./defaultHelp";
import { defaultStore } from "./defaultStore";
import { defaultStats } from "./defaultStats";
import { defaultStates } from "./defaultStates";
import { defaultCommit, defaultGitTree, defaultRemote } from "./defaultGitTree";
import { orderGenerator } from "services/orderGenerator";
import { defaultItemData } from "./defaultItemData";
import { defaultOrderService } from "./defaultOrderService";
import { copyObjectWithoutRef } from "services/helpers";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import {
  IGitCooking,
  IItemInterface,
  IOrderService,
  IStore,
} from "types/gameDataInterfaces";

export const defaultGameData: IGitCooking = {
  states: copyObjectWithoutRef(defaultStates),
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
  orderService: copyObjectWithoutRef(defaultOrderService),
  commandHistory: [],
  completeDay: function () {
    let copy: IGitCooking = copyObjectWithoutRef(this);
    if (copy.states.isDayComplete) return copy;

    let updatedStore: IStore = copy.store.unlockStoreItemsByDay(
      copy.states.day
    );

    const activeRemote = copy.git.getActiveProject()?.remote;
    if (activeRemote) {
      const { totalProfit } = calculateRevenueAndCost(
        copy,
        activeRemote.branches
      );
      updatedStore.cash += totalProfit;
    }

    copy.git.projects = copy.git.projects.map((p) => {
      p.unlocked = p.unlockDay <= copy.states.day;
      return p;
    });
    copy.states.gameState = GameState.SUMMARY;
    copy.states.isDayComplete = false;
    copy.states.doneMerging = false;
    copy.states.hasStartedFetch = false;
    copy.store = updatedStore;
    return copy;
  },
  endDay: function (timeLapsed) {
    let copy: IGitCooking = copyObjectWithoutRef(this);

    const dayLength = copy.stats.dayLength.value;
    copy.states.endedDayTime =
      timeLapsed && !copy.states.isDayComplete ? timeLapsed : dayLength;
    copy.states.gameState = GameState.MERGE;

    return copy;
  },
  startDay: function () {
    let copy = copyObjectWithoutRef(this);
    copy.states.day += 1;
    copy.states.gameState = GameState.WORKING;
    copy.states.dayIsCompleted = false;
    return copy;
  },
  startFetch: function () {
    let copy: IGitCooking = copyObjectWithoutRef(this);
    if (copy.states.hasStartedFetch) {
      copy.states.gameState = GameState.FETCH;
      return copy;
    }

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const orderServiceReset: IOrderService =
      copyObjectWithoutRef(defaultOrderService);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const projectsReset: IProject[] = copy.git.projects.map((p) => {
      return {
        ...p,
        remote: defaultRemote,
      };
    });
    const gitUpdated: IGitTree = {
      ...gitReset,
      projects: projectsReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copy.states.endedDayTime = 0;
    copy.git = gitUpdated;
    copy.itemInterface = itemInterfaceReset;
    copy.orderService = orderServiceReset;

    // create new branches
    const mainBranchName = "main";
    const newProjects = copy.git.projects.map((p) => {
      const copyProject: IProject = copyObjectWithoutRef(p);
      const nrOfBranches = 3;
      const newBranches = orderGenerator.generateSetOfBranches(
        copy,
        nrOfBranches,
        copyProject
      );
      const remoteMainBranch: IRemoteBranch = {
        orders: [],
        targetCommitId: copyProject.remote.commits[0].id || defaultCommit.id,
        name: mainBranchName,
        isMain: true,
        isFetched: copyProject.cloned,
        stats: {
          missingIngredients: [],
          maxProfit: 0,
          orders: [],
          itemCount: 0,
          difficulty: Difficulty.NORMAL,
        },
      };
      newBranches.push(remoteMainBranch);

      copyProject.remote.branches = newBranches;
      copyProject.remote = copyProject.remote.updateBranchStats(copy);
      return copyProject;
    });
    copy.git.projects = newProjects;

    // switch to main branch on cloned projects
    copy.git.projects.forEach((p) => {
      if (!p.cloned) return;
      const remoteMainBranch = p.remote.getBranch(mainBranchName);
      if (!remoteMainBranch) return;
      // create new branch that tracks remote
      copy.git = copy.git.addNewBranch(mainBranchName, remoteMainBranch.name);
      copy.git = copy.git.switchBranch(mainBranchName);
      // update commits
      p.remote
        .getCommitHistory(remoteMainBranch?.targetCommitId)
        .forEach((c) => {
          if (copy.git.commits.some((c1) => c1.id === c.id)) return;
          copy.git.commits.push(c);
        });
      // update orders
      copy.orderService = copy.orderService.setNewOrders(
        remoteMainBranch.orders,
        remoteMainBranch.name
      );
      // switch branch for orders
      copy.orderService = copy.orderService.switchBranch(
        remoteMainBranch.name,
        remoteMainBranch.name
      );
    });

    copy.states.hasStartedFetch = true;
    copy.states.gameState = GameState.FETCH;

    return copy;
  },
};

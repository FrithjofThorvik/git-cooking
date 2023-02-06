import { IGitTree } from "types/gitInterfaces";
import { GameState } from "types/enums";
import { defaultHelp } from "./defaultHelp";
import { defaultStore } from "./defaultStore";
import { defaultStats } from "./defaultStats";
import { defaultStates } from "./defaultStates";
import { defaultGitTree } from "./defaultGitTree";
import { orderGenerator } from "services/orderGenerator";
import { defaultItemData } from "./defaultItemData";
import { defaultOrderService } from "./defaultOrderService";
import { copyObjectWithoutRef } from "services/helpers";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { IGitCooking, IItemInterface, IStore } from "types/gameDataInterfaces";

export const defaultGameData: IGitCooking = {
  states: copyObjectWithoutRef(defaultStates),
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
  orderService: copyObjectWithoutRef(defaultOrderService),
  commandHistory: [],
  endDay: function (timeLapsed) {
    let copy: IGitCooking = copyObjectWithoutRef(this);

    const dayLength = copy.stats.dayLength.value;
    copy.states.endedDayTime =
      timeLapsed && !copy.states.isDayComplete ? timeLapsed : dayLength;

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
    copy.states.gameState = GameState.MERGE;
    copy.store = updatedStore;
    copy.states.isDayComplete = false;
    copy.states.hasStartedFetch = false;

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
    if (this.states.hasStartedFetch) {
      copy.states.gameState = GameState.FETCH;
      return copy;
    }

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const gitUpdated: IGitTree = {
      ...gitReset,
      projects: copy.git.projects,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copy.states.endedDayTime = 0;
    copy.git = gitUpdated;
    copy.itemInterface = itemInterfaceReset;

    copy.git.projects = copy.git.projects.map((p) => {
      const nrOfBranches = 3;
      const branches = orderGenerator.generateSetOfBranches(copy, nrOfBranches);
      p.remote.branches = branches;
      p.remote = p.remote.updateBranchStats(copy);
      return p;
    });

    copy.states.hasStartedFetch = true;
    copy.states.gameState = GameState.FETCH;

    return copy;
  },
};

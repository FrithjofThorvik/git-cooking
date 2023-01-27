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

    const { totalProfit } = calculateRevenueAndCost(copy);
    let updatedStore: IStore = copy.store.unlockStoreItemsByDay(
      copy.states.day
    );
    updatedStore.cash += totalProfit;

    copy.states.gameState = GameState.SUMMARY;
    copy.store = updatedStore;
    copy.states.isDayComplete = false;
    copy.states.hasFetched = false;

    return copy;
  },
  startDay: function () {
    let copy = copyObjectWithoutRef(this);
    copy.states.gameState = GameState.WORKING;
    copy.states.dayIsCompleted = false;
    return copy;
  },
  startFetch: function () {
    let copy: IGitCooking = copyObjectWithoutRef(this);
    if (this.states.hasFetched) {
      copy.states.gameState = GameState.FETCH;
      return copy;
    }

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const gitUpdated: IGitTree = {
      ...gitReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copy.states.day += 1;
    copy.git = gitUpdated;
    copy.itemInterface = itemInterfaceReset;

    copy.git.remote.branches = [];

    const nrOfBranches = 3;
    const branches = orderGenerator.generateSetOfBranches(copy, nrOfBranches);

    branches.forEach((b) => {
      copy.git.remote.branches.push(b);
    });

    copy.git.remote = copy.git.remote.updateBranchStats(copy);
    copy.states.hasFetched = true;
    copy.states.gameState = GameState.FETCH;

    return copy;
  },
};

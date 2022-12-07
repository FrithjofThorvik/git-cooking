import { IGitTree } from "types/gitInterfaces";
import { GameState } from "types/enums";
import { defaultHelp } from "./defaultHelp";
import { defaultStore } from "./defaultStore";
import { defaultStats } from "./defaultStats";
import { defaultGitTree } from "./defaultGitTree";
import { orderGenerator } from "services/orderGenerator";
import { defaultItemData } from "./defaultItemData";
import { copyObjectWithoutRef } from "services/helpers";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { IGitCooking, IItemInterface, IStore } from "types/gameDataInterfaces";
import { defaultOrderService } from "./defaultOrderService";

export const defaultGameData: IGitCooking = {
  day: 1,
  gameState: GameState.LOADING,
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
  orderService: copyObjectWithoutRef(defaultOrderService),
  commandHistory: [],
  endDay: function () {
    let copy: IGitCooking = copyObjectWithoutRef(this);

    const { profit } = calculateRevenueAndCost(copy);
    let updatedStore: IStore = copy.store.unlockStoreItemsByDay(copy.day);
    updatedStore.cash += profit;

    copy.gameState = GameState.SUMMARY;
    copy.store = updatedStore;

    return copy;
  },
  startDay: function () {
    let copy = copyObjectWithoutRef(this);
    copy.gameState = GameState.WORKING;

    return copy;
  },
  startPull: function () {
    let copy: IGitCooking = copyObjectWithoutRef(this);

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const gitUpdated: IGitTree = {
      ...gitReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copy.day += 1;
    copy.git = gitUpdated;
    copy.itemInterface = itemInterfaceReset;

    copy.git.remote.branches = [];

    const nrOfBranches = 3;
    const orders = orderGenerator.generateSetOfNewORders(copy, nrOfBranches);

    copy.git.remote.branches.push({ orders: orders[0], name: "main" });
    copy.git.remote.branches.push({ orders: orders[1], name: "dev" });
    copy.git.remote.branches.push({ orders: orders[2], name: "test" });

    copy.gameState = GameState.PULL;

    return copy;
  },
};

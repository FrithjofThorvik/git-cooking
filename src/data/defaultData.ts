import { GameState } from "types/enums";
import { defaultHelp } from "./defaultHelp";
import { IGitCooking, IItemInterface, IStore } from "types/gameDataInterfaces";
import { defaultStore } from "./defaultStore";
import { defaultStats } from "./defaultStats";
import { defaultGitTree } from "./defaultGitTree";
import { defaultItemData } from "./defaultItemData";
import { copyObjectWithoutRef } from "services/helpers";
import { calculateRevenueAndCost } from "services/gameDataHelper";
import { IGitTree } from "types/gitInterfaces";

export const defaultGameData: IGitCooking = {
  day: 1,
  gameState: GameState.WORKING,
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
  commandHistory: [],
  endDay: function () {
    let copyGameData = copyObjectWithoutRef(this)
    const { revenue, cost } = calculateRevenueAndCost(copyGameData);
    let updatedStore: IStore = copyGameData.store.unlockStoreItemsByDay(copyGameData.day);
    updatedStore.cash += (revenue - cost)

    copyGameData.gameState = GameState.SUMMARY;
    copyGameData.store = updatedStore;

    return copyGameData;
  },
  startDay: function () {
    let copyGameData = copyObjectWithoutRef(this);

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const gitUpdated: IGitTree = {
      ...gitReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copyGameData.day += 1;
    copyGameData.git = gitUpdated;
    copyGameData.itemInterface = itemInterfaceReset;
    copyGameData.gameState = GameState.WORKING

    return copyGameData;
  },
};

export const emptyGameData: IGitCooking = {
  day: 1,
  gameState: GameState.LOADING,
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
  commandHistory: [],
  endDay: function () {
    let copyGameData = copyObjectWithoutRef(this)
    const { revenue, cost } = calculateRevenueAndCost(copyGameData);
    let updatedStore: IStore = copyGameData.store.unlockStoreItemsByDay(copyGameData.day);
    updatedStore.cash += (revenue - cost)

    copyGameData.gameState = GameState.SUMMARY;
    copyGameData.store = updatedStore;

    return copyGameData;
  },
  startDay: function () {
    let copyGameData = copyObjectWithoutRef(this);

    const gitReset: IGitTree = copyObjectWithoutRef(defaultGitTree);
    const itemInterfaceReset: IItemInterface =
      copyObjectWithoutRef(defaultItemData);
    const gitUpdated: IGitTree = {
      ...gitReset,
      workingDirectory: { ...gitReset.workingDirectory },
    };

    copyGameData.day += 1;
    copyGameData.git = gitUpdated;
    copyGameData.itemInterface = itemInterfaceReset;
    copyGameData.gameState = GameState.WORKING

    return copyGameData;
  },
};

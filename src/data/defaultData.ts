import { GameState } from "types/enums";
import { defaultHelp } from "./defaultHelp";
import { IGitCooking } from "types/gameDataInterfaces";
import { defaultStore } from "./defaultStore";
import { defaultStats } from "./defaultStats";
import { defaultGitTree } from "./defaultGitTree";
import { defaultItemData } from "./defaultItemData";
import { copyObjectWithoutRef } from "services/helpers";

export const defaultGameData: IGitCooking = {
  day: 0,
  gameState: GameState.SUMMARY,
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
};

export const emptyGameData: IGitCooking = {
  day: 0,
  gameState: GameState.LOADING,
  stats: copyObjectWithoutRef(defaultStats),
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
  help: copyObjectWithoutRef(defaultHelp),
};

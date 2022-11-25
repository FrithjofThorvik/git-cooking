import { GameState } from "types/enums";
import { IGitCooking } from "types/gameDataInterfaces";
import { defaultStore } from "./defaultStore";
import { defaultGitTree } from "./defaultGitTree";
import { defaultItemData } from "./defaultItemData";
import { copyObjectWithoutRef } from "services/helpers";

export const defaultGameData: IGitCooking = {
  day: 0,
  baseDayLength: 600000, // in milliseconds
  gameState: GameState.WORKING,
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
};

export const emptyGameData: IGitCooking = {
  day: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  itemInterface: copyObjectWithoutRef(defaultItemData),
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
};

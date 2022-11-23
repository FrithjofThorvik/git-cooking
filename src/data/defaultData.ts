import { GameState } from "types/enums";
import { IGitCooking } from "types/gameDataInterfaces";
import { defaultGitTree } from "./defaultGitTree";
import { copyObjectWithoutRef } from "services/helpers";
import { defaultStore } from "./defaultStore";

export const defaultGameData: IGitCooking = {
  day: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.WORKING,
  selectedItems: [],
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
};

export const emptyGameData: IGitCooking = {
  day: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  selectedItems: [],
  store: copyObjectWithoutRef(defaultStore),
  git: copyObjectWithoutRef(defaultGitTree),
};

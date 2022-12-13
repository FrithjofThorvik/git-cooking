import {
  IGitCommand,
  IIngredient,
  IUpgrade,
  StoreItem,
} from "types/gameDataInterfaces";

export const isUpgrade = (obj: StoreItem): obj is IUpgrade => {
  return obj.hasOwnProperty("maxLevel");
};

export const isIngredient = (obj: StoreItem): obj is IIngredient => {
  return obj.hasOwnProperty("useCost");
};

export const isGitCommand = (obj: StoreItem): obj is IGitCommand => {
  return obj.hasOwnProperty("gitCommandType");
};

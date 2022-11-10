import { upgrades } from "./upgrades";
import { foodItems } from "./ingredients";
import {
  IBranch,
  IBurger,
  IDirectory,
  IFries,
  IGitCooking,
} from "types/gameDataInterfaces";
import { GameState, IngredientType } from "types/enums";
import { foodBuilder } from "services/foodBuilders";

export const defaultDirectory: IDirectory = {
  orders: [],
  foods: [
    {
      id: "1",
      name: "Burger",
      type: IngredientType.BURGER,
      unlocked: true,
      ingredients: foodItems.burger,
      builder: (ingredients) => foodBuilder.buildBurger(ingredients as IBurger),
    },
    {
      id: "2",
      name: "Fries",
      unlocked: true,
      type: IngredientType.EXTRA,
      ingredients: foodItems.fries,
      builder: (ingredients) => foodBuilder.buildFries(ingredients as IFries),
    },
  ],
};

const defaultBranch: IBranch = {
  name: "master",
  directory: defaultDirectory,
  commits: [],
};

export const defaultGameData: IGitCooking = {
  day: 0,
  cash: 250,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.WORKING,
  upgrades: upgrades,
  directory: defaultDirectory,
  selectedItems: [],
  gitActiveBranch: defaultBranch,
  gitBranches: [defaultBranch],
  gitModifiedItems: [],
  gitStagedItems: [],
};

export const emptyGameData: IGitCooking = {
  day: 0,
  cash: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  upgrades: [],
  directory: { orders: [], foods: [] },
  selectedItems: [],
  gitActiveBranch: defaultBranch,
  gitBranches: [],
  gitModifiedItems: [],
  gitStagedItems: [],
};

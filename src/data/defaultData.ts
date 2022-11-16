import { v4 } from "uuid";
import { upgrades } from "./upgrades";
import { foodItems } from "./ingredients";
import {
  IBurger,
  IDirectory,
  IFries,
  IGitCooking,
} from "types/gameDataInterfaces";
import { GameState, IngredientType } from "types/enums";
import { foodBuilder } from "services/foodBuilders";
import { ICommit, IGitTree } from "types/gitInterfaces";

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

const defaultCommit: ICommit = {
  id: v4(),
  root: true,
  parents: [],
  message: "root commit",
  directory: defaultDirectory,
};

const defaultGit: IGitTree = {
  branches: [
    {
      name: "master",
      targetCommitId: defaultCommit.id,
    },
  ],
  commits: [defaultCommit],
  HEAD: {
    targetId: "master",
  },
  workingDirectory: defaultDirectory,
  stagedItems: [],
  modifiedItems: [],
};

export const defaultGameData: IGitCooking = {
  day: 0,
  cash: 250,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.WORKING,
  upgrades: upgrades,
  git: defaultGit,
  selectedItems: [],
};

export const emptyGameData: IGitCooking = {
  day: 0,
  cash: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  upgrades: [],
  git: {
    branches: [],
    workingDirectory: defaultDirectory,
    commits: [
      {
        id: v4(),
        root: true,
        parents: [],
        message: "root commit",
        directory: defaultDirectory,
      },
    ],
    HEAD: {
      targetId: "master",
    },
    stagedItems: [],
    modifiedItems: [],
  },
  selectedItems: [],
};

import { upgrades } from "./upgrades";
import { ingredients } from "./ingredients";
import { IBranch, IDirectory, IGitCooking } from "types/gameDataInterfaces";
import { FileType, FolderType, GameState, IngredientType } from "types/enums";

export const defaultDirectory: IDirectory = {
  folders: [
    {
      name: "orders",
      isOpen: false,
      type: FolderType.ROOT,
      folders: [],
      files: [],
    },
    {
      name: "ingredients",
      isOpen: false,
      type: FolderType.ROOT,
      folders: [
        {
          name: "burger",
          isOpen: true,
          type: FolderType.INGREDIENT,
          folders: [],
          files: [
            {
              name: "top_bun.ing",
              type: FileType.INGREDIENT,
              ingredientType: IngredientType.BURGER,
              ingredient: ingredients.burger.bunTop,
              path: "orders/ingredients/burger/top_bun.ing",
            },
          ],
        },
      ],
      files: [],
    },
  ],
  files: [],
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
  gitActiveBranch: defaultBranch,
  gitBranches: [defaultBranch],
  gitModifiedFiles: [],
  gitStagedFiles: [],
};

export const emptyGameData: IGitCooking = {
  day: 0,
  cash: 0,
  baseDayLength: 60000, // in milliseconds
  gameState: GameState.LOADING,
  upgrades: [],
  directory: { files: [], folders: [] },
  gitActiveBranch: defaultBranch,
  gitBranches: [],
  gitModifiedFiles: [],
  gitStagedFiles: [],
};

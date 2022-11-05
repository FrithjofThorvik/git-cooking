import { ingredients } from "./ingredients";
import { IGitCooking } from "types/interfaces";
import { FileType, FolderType, GameState, IngredientType } from "types/enums";
import { upgrades } from "./upgrades";

export const defaultGameData: IGitCooking = {
  day: 0,
  timeLapsed: 0,
  baseDayLength: 60000, // in milliseconds
  cash: 250,
  gameState: GameState.WORKING,
  upgrades: upgrades,
  directory: {
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
              },
            ],
          },
        ],
        files: [],
      },
    ],
    files: [],
  },
};

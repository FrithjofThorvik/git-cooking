import { upgrades } from "./upgrades";
import { ingredients } from "./ingredients";
import { IBranch, IDirectory, IGitCooking } from "types/gameDataInterfaces";
import { GameState, IngredientType } from "types/enums";

export const defaultDirectory: IDirectory = {
  orders: [
    {
      id: "1",
      name: "order #1",
      isCreated: false,
      orderItems: [
        {
          id: "3",
          name: "burger",
          path: "orders/order1/burger",
          ingredients: [],
          type: IngredientType.BURGER,
          orderId: "1",
        },
      ],
      items: [
        {
          id: "3",
          name: "burger",
          path: "orders/order1/burger",
          ingredients: [],
          type: IngredientType.BURGER,
          orderId: "1",
        },
      ],
    },
    {
      id: "2",
      name: "order #2",
      isCreated: false,
      orderItems: [
        {
          id: "4",
          name: "burger",
          path: "orders/order2/burger",
          ingredients: [],
          type: IngredientType.BURGER,
          orderId: "2",
        },
      ],
      items: [
        {
          id: "4",
          name: "burger",
          path: "orders/order2/burger",
          ingredients: [],
          type: IngredientType.BURGER,
          orderId: "2",
        },
        {
          id: "5",
          name: "burger2",
          path: "orders/order2/burger2",
          ingredients: [],
          type: IngredientType.BURGER,
          orderId: "2",
        },
      ],
    },
  ],
  foods: [
    {
      id: "123",
      name: "burger",
      items: [ingredients.burger.bunTop],
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

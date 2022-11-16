import { GameState, IngredientType, UpgradeType } from "./enums";
import { IGitTree, ICommit } from "./gitInterfaces";

export interface IDirectory {
  orders: IOrder[];
  foods: IFood[];
}

export interface IOrderItem {
  id: string;
  name: string;
  path: string;
  orderId: string;
  type: IngredientType;
  ingredients: IIngredient[];
}

export interface IOrder {
  id: string;
  name: string;
  isCreated: boolean;
  timeStart: number;
  timeEnd: number;
  orderItems: IOrderItem[];
  items: IOrderItem[];
}

export type Item = IOrderItem | IIngredient;

export interface IFood {
  id: string;
  name: string;
  unlocked: boolean;
  type: IngredientType;
  builder: (ingredients: FoodType) => IIngredient[];
  ingredients: FoodType;
}

export type FoodType = IBurger | IFries;

export interface FoodDict {
  [key: string]: IIngredient;
}

export interface IBurger extends FoodDict {
  bunTop: IIngredient;
  paddy: IIngredient;
  salad: IIngredient;
  onions: IIngredient;
  bunBottom: IIngredient;
}

export interface IFries extends FoodDict {
  cheese: IIngredient;
  normal: IIngredient;
}

export interface IIngredient {
  name: string;
  cost: number;
  path: string;
  image: string;
  purchased: boolean;
  type: IngredientType;
}

export interface IUpgrade {
  id: number;
  name: string;
  price: number;
  image: string;
  purchased: boolean;
  unlocked: boolean;
  description: string;
  type: UpgradeType;
}

export interface ICommitHistory {
  commits: ICommit[];
}

export interface IGitCooking {
  day: number;
  cash: number;
  baseDayLength: number;
  gameState: GameState;
  upgrades: IUpgrade[];
  selectedItems: string[];
  git: IGitTree;
}

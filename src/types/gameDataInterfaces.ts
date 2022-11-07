import {
  FileType,
  FolderType,
  GameState,
  GitStatus,
  IngredientType,
  UpgradeType,
} from "./enums";

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
  orderItems: IOrderItem[];
  items: IOrderItem[];
}

export type Item = IOrderItem | IIngredient;

export interface IFood {
  id: string;
  name: string;
  items: IIngredient[];
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

export interface IBranch {
  name: string;
  directory: IDirectory;
  commits: ICommit[];
}

export interface ICommit {
  id: string;
  message: string;
  branch: IBranch;
  parent: ICommit | null;
  child: ICommit | null;
}

export interface ICommitHistory {
  commits: ICommit[];
}

export interface IGitCooking {
  day: number;
  cash: number;
  baseDayLength: number;
  gameState: GameState;
  directory: IDirectory;
  upgrades: IUpgrade[];
  selectedItems: IOrderItem[];
  gitStagedItems: Item[];
  gitModifiedItems: Item[];
  gitBranches: IBranch[];
  gitActiveBranch: IBranch;
}

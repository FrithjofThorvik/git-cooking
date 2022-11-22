import { IFood } from "./foodInterfaces";
import { IGitTree } from "./gitInterfaces";
import { GameState, IngredientType, UpgradeType } from "./enums";

export interface IDirectory {
  orders: IOrder[];
  deleteOrderItem: (orderItem: IOrderItem) => IDirectory;
  modifyOrderItem: (
    orderItem: IOrderItem,
    data: {
      type?: IngredientType;
      addIngredient?: IIngredient;
      removeIngredientAtIndex?: number;
    },
    modify: (orderItem: IOrderItem) => void
  ) => IDirectory;
  createOrderFolder: (order: IOrder) => IDirectory;
  addOrderItemToOrder: (order: IOrder, orderItem: IOrderItem) => IDirectory;
}

export interface IOrderItem {
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

export interface IStore {
  foods: IFood[];
  upgrades: IUpgrade[];
  cash: number;
  purchaseIngredient: (ingredient: IIngredient) => IStore;
  purchaseUpgrade: (upgrade: IUpgrade) => IStore;
}

export interface IPurchasable {
  id: string;
  name: string;
  cost: number;
  image: string;
  purchased: boolean;
}

export interface IIngredient extends IPurchasable {
  type: IngredientType;
}

export interface IUpgrade extends IPurchasable {
  type: UpgradeType;
  unlocked: boolean;
  description: string;
}

export interface IGitCooking {
  day: number;
  git: IGitTree;
  store: IStore;
  gameState: GameState;
  baseDayLength: number;
  selectedItems: string[];
}

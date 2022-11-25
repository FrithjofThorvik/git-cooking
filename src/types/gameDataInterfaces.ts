import { IFood } from "./foodInterfaces";
import { IGitTree } from "./gitInterfaces";
import { GameState, GitCommandType, IngredientType } from "./enums";

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
  updatePercentageCompleted: () => IDirectory;
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
  percentageCompleted: number;
  orderItems: IOrderItem[];
  createdItems: IOrderItem[];
}

export interface IStore {
  foods: IFood[];
  upgrades: IUpgrade[];
  gitCommands: IGitCommand[];
  cash: number;
  purchase: (purchasable: IPurchasable) => IStore;
}

export interface IPurchasable {
  id: string;
  name: string;
  cost: number;
  image: string;
  purchased: boolean;
  unlocked?: boolean;
  description?: string;
  gitCommandType?: GitCommandType;
}

export interface IIngredient extends IPurchasable {
  type: IngredientType;
  useCost: number;
}

export interface IUpgrade extends IPurchasable {
  unlocked: boolean;
  description: string;
}

export interface IGitCommand extends IPurchasable {
  unlocked: boolean;
  description: string;
  gitCommandType: GitCommandType;
}

export interface IItemInterface {
  selectedItemIds: string[];
  activeItemId: string;
  openItem: (orderItem: IOrderItem) => IItemInterface;
  closeItem: (orderItem: IOrderItem) => IItemInterface;
}

export interface IGitCooking {
  day: number;
  git: IGitTree;
  store: IStore;
  gameState: GameState;
  baseDayLength: number;
  itemInterface: IItemInterface;
}

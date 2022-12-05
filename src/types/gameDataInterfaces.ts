import { IFood } from "./foodInterfaces";
import { IGitTree } from "./gitInterfaces";
import {
  GameState,
  GitCommandType,
  IngredientType,
  TutorialType,
  UpgradeType,
} from "./enums";

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
  purchase: (purchasable: StoreItem, discountMultiplier: number) => IStore;
}

export type StoreItem = IIngredient | IUpgrade | IGitCommand;

export interface IPurchasable {
  id: string;
  image: string;
  purchased: boolean;
  unlocked?: boolean;
  gitCommandType?: GitCommandType;
}

export interface IIngredient extends IPurchasable {
  type: IngredientType;
  useCost: number;
  name: string;
  cost: number;
}

export interface IUpgrade extends IPurchasable {
  unlocked: boolean;
  type: UpgradeType;
  level: number;
  maxLevel: number;
  name: () => string;
  cost: (discountMultiplier: number) => number;
  apply: (value: number) => number;
  effect: () => { current: number; next: number };
  description: () => string;
}

export interface IGitCommand extends IPurchasable {
  unlocked: boolean;
  gitCommandType: GitCommandType;
  name: () => string;
  cost: (discountMultiplier: number) => number;
  description: () => string;
}

export interface IItemInterface {
  selectedItemIds: string[];
  activeItemId: string;
  openItem: (orderItem: IOrderItem) => IItemInterface;
  closeItem: (orderItem: IOrderItem) => IItemInterface;
}

export interface IStat {
  base: number;
  get: (upgrades: IUpgrade[]) => number;
}

export interface IStats {
  discountMultiplier: IStat;
  dayLength: IStat;
  costReductionMultiplier: IStat;
  revenueMultiplier: IStat;
}

export interface ITutorialScreen {
  img: string;
  title: string;
  prompts: string[];
}

export interface ITutorial {
  type: TutorialType;
  completed: boolean;
  description: string;
  screens: ITutorialScreen[];
}

export interface IHelp {
  tutorials: ITutorial[];
  isHelpScreenOpen: boolean;
  completeTutorial: (tutorial: ITutorial) => IHelp;
  setIsHelpScreenOpen: (isOpen: boolean) => IHelp;
  getTutorialsByTypes: (types: TutorialType[]) => ITutorial[];
}

export interface IGitCooking {
  day: number;
  help: IHelp;
  git: IGitTree;
  store: IStore;
  stats: IStats;
  gameState: GameState;
  itemInterface: IItemInterface;
}

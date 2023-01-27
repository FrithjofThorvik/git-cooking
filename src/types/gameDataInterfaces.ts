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
  createdItems: IOrderItem[];
  addOrderItem: (orderItem: IOrderItem) => IDirectory;
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
  image: string;
  isCreated: boolean;
  isAvailable: boolean;
  startTime?: number;
  spawning?: boolean;
  percentageCompleted: number;
  orderItems: IOrderItem[];
}

export interface IStore {
  foods: IFood[];
  upgrades: IUpgrade[];
  gitCommands: IGitCommand[];
  cash: number;
  purchase: (
    purchasable: StoreItem,
    stats: IStats
  ) => { store: IStore; stats: IStats };
  unlockStoreItemsByDay: (day: number) => IStore;
}

export type StoreItem = IIngredient | IUpgrade | IGitCommand;

export interface IPurchasable {
  id: string;
  image: string;
  purchased: boolean;
  unlocked: boolean;
  unlockDay: number;
  gitCommandType?: GitCommandType;
}

export interface IIngredient extends IPurchasable {
  type: IngredientType;
  useCost: number;
  default?: boolean;
  isSingle?: boolean;
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
  apply: (stats: IStats) => IStats;
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
  value: number;
}

export interface IStats {
  discountMultiplier: IStat;
  dayLength: IStat;
  costReductionMultiplier: IStat;
  revenueMultiplier: IStat;
  spawnTime: IStat;
}

export interface ITutorialScreen {
  img?: string;
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
  completeTutorials: (tutorials: ITutorial[]) => IHelp;
  setIsHelpScreenOpen: (isOpen: boolean) => IHelp;
  getTutorialsByTypes: (types: TutorialType[]) => ITutorial[];
}

export interface IOrderService {
  _orders: IOrder[];
  branches: { orders: IOrder[]; name: string }[];
  getAvailableOrders: () => IOrder[];
  getAllOrders: () => IOrder[];
  createOrderFolder: (order: IOrder) => IOrderService;
  updatePercentageCompleted: (createdItems: IOrderItem[]) => IOrderService;
  setNewOrders: (orders: IOrder[], branchName?: string) => IOrderService;
  switchBranch: (fromBranchName: string, toBranchName: string) => IOrderService;
}

export interface IStates {
  day: number;
  gameState: GameState;
  isDayComplete: boolean;
  hasFetched: boolean;
  endedDayTime: number;
  setGameState: (state: GameState) => IStates;
}

export interface IGitCooking {
  states: IStates;
  help: IHelp;
  git: IGitTree;
  store: IStore;
  stats: IStats;
  orderService: IOrderService;
  commandHistory: string[];
  itemInterface: IItemInterface;
  endDay: (timeLapsed: number) => IGitCooking;
  startDay: () => IGitCooking;
  startFetch: () => IGitCooking;
}

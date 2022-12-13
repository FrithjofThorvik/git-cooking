export enum GameState {
  FETCH,
  SUMMARY,
  WORKING,
  UPGRADE,
  LOADING,
}

export enum FolderType {
  ROOT,
  INGREDIENT,
  ORDER,
}

export enum FileType {
  INGREDIENT,
  ORDER,
}

export enum IngredientType {
  BURGER = "Burger",
  EXTRA = "Extra",
  DRINKS = "Drinks",
}

export enum PurchaseType {
  UPGRADES = "Upgrades",
  COMMANDS = "Git Commands",
  INGREDIENTS = "Ingredients",
}

export enum GitStatus {
  CREATED,
  DELETED,
  MODIFIED,
  UNMODIFIED,
}

export enum GitCommandType {
  RESTORE = "restore",
  CHECKOUT = "checkout",
  BRANCH = "branch",
  PUSH = "push",
  FETCH = "fetch",
  ADD = "add",
  COMMIT = "commit",
  STATUS = "status",
}

export enum UpgradeType {
  DISCOUNT,
  DAY_LENGTH,
  COST_REDUCTION,
  REVENUE_MULTIPLIER,
  SPAWN_TIME,
}

export enum TutorialType {
  FETCH_INTRO = "Welcome to GitCookin",
  FETCH_CONTENT = "Learn to fetch from origin",
  WORK_FOLDERS = "Order Folders",
  WORK_ITEMS = "Order Items",
  WORK_SCREEN = "Get familiar with the Work Screen",
  WORK_TERMINAL = "How to use the terminal",
  WORK_ORDERS = "Orders",
  WORK_PUSH = "End day",
}

export enum Difficulty {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

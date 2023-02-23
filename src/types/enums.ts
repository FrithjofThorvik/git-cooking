export enum GameState {
  FETCH,
  MERGE,
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
  CLONE = "clone",
}

export enum UpgradeType {
  DISCOUNT,
  DAY_LENGTH,
  COST_REDUCTION,
  REVENUE_MULTIPLIER,
  SPAWN_TIME,
}

export enum TutorialType {
  GAME_INTRO = "Welcome to GitCooking!",
  TERMINAL = "What is a Terminal?",
  CLONE = "Learn to clone a repository",
  FETCH = "Learn to fetch new branches",
  ORIGIN = "What is origin?",
  WORK_FOLDERS = "Order Folders",
  WORK_ITEMS = "Order Items",
  WORK_SCREEN = "The Work Screen!",
  WORK_ADD_FILES = "How to add files",
  WORK_COMMIT = "How to commit",
  WORK_ORDERS = "Orders",
  WORK_PUSH = "End day",
  MERGE = "Integrate your work",
  NEW_DAY = "A new day!",
  WORK_CHECKOUT = "Checkout other restaurants!",
  TIMES_UP = "Time's up!",
  HELP = "Need more help?",
  PROJECT = "More remote repositories!",
}

export enum Difficulty {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

export enum HelpScreenType {
  TUTORIALS = "tutorials",
  COMMANDS = "commands",
  CONCEPTS = "concepts",
}

export enum RemoteType {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

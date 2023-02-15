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
  CLONE_INTRO = "Welcome to GitCookin",
  CLONE_CONTENT = "Learn to clone a repository",
  FETCH_INTRO = "A new day!",
  FETCH_CONTENT = "Learn to fetch new branches",
  WORK_FOLDERS = "Order Folders",
  WORK_ITEMS = "Order Items",
  WORK_SCREEN = "Get familiar with the Work Screen",
  WORK_TERMINAL = "How to use the terminal",
  WORK_ORDERS = "Orders",
  WORK_PUSH = "End day",
  WORK_CHECKOUT = "Checkout other restaurants!",
  MERGE = "Integrate your work",
  HELP = "Need more help?",
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

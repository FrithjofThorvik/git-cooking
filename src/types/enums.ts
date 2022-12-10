export enum GameState {
  FETCH,
  SUMMARY,
  WORKING,
  UPGRADE,
  MERGE,
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
  STORE_UPGRADES = "Upgrades",
  STORE_INGREDIENTS = "Ingredients",
  STORE_GIT_COMMANDS = "Purchase Git Commands",
}

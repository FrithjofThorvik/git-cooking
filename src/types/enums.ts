export enum GameState {
  STARTING,
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
  RESTORE,
  CHECKOUT,
  BRANCH,
}

export enum UpgradeType {
  DISCOUNT,
  DAY_LENGTH,
  COST_REDUCTION,
  REVENUE_MULTIPLIER,
}

export enum TutorialType {
  STORE_UPGRADES = "Upgrades",
  STORE_INGREDIENTS = "Ingredients",
  STORE_GIT_COMMANDS = "Purchase Git Commands",
}

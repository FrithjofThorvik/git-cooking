import {
  IGitCommand,
  IIngredient,
  IStats,
  IStore,
  IUpgrade,
  StoreItem,
} from "types/gameDataInterfaces";
import { defaultFoods } from "./defaultFoods";
import { defaultUpgrades } from "./defaultUpgrades";
import { defaultGitCommands } from "./defaultGitCommands";
import { copyObjectWithoutRef } from "services/helpers";
import { isGitCommand, isIngredient, isUpgrade } from "services/typeGuards";
import { IFood } from "types/foodInterfaces";

export const defaultStore: IStore = {
  foods: copyObjectWithoutRef(defaultFoods),
  upgrades: copyObjectWithoutRef(defaultUpgrades),
  gitCommands: copyObjectWithoutRef(defaultGitCommands),
  cash: 0,
  purchase: function (purchasable: StoreItem, stats: IStats) {
    const discountMultiplier: number = stats.discountMultiplier.value;
    let copyStore: IStore = copyObjectWithoutRef(this);
    let copyStats: IStats = copyObjectWithoutRef(stats);

    // Purchase upgrade
    if (isUpgrade(purchasable)) {
      let upgrade: IUpgrade = purchasable;
      copyStore.upgrades.forEach((u) => {
        if (
          u.id === upgrade.id &&
          copyStore.cash >= u.cost(discountMultiplier)
        ) {
          if (u.level === u.maxLevel) u.purchased = true;
          copyStore.cash -= u.cost(discountMultiplier);
          u.level += 1; // NB! Level up after money is subtracted, but before the stat is applied!
          copyStats = u.apply(copyStats);
        }
      });
    }

    // Git Command
    else if (isGitCommand(purchasable)) {
      let gitCommand: IGitCommand = purchasable;
      copyStore.gitCommands.forEach((g) => {
        if (
          g.id === gitCommand.id &&
          copyStore.cash >= g.cost(discountMultiplier)
        ) {
          g.purchased = true;
          copyStore.cash -= g.cost(discountMultiplier);
        }
      });
    }

    // Ingredient
    else if (isIngredient(purchasable)) {
      let ingredient: IIngredient = purchasable;
      copyStore.foods.forEach((f) => {
        if (f.type === ingredient.type) {
          Object.values(f.ingredients).map((i) => {
            if (i.name === ingredient.name && copyStore.cash >= i.cost) {
              i.purchased = true;
              copyStore.cash -= i.cost;
            }
          });
        }
      });
    }

    return { store: copyStore, stats: copyStats };
  },
  unlockStoreItemsByDay: function (day: number) {
    let copyStore: IStore = copyObjectWithoutRef(this);

    copyStore.foods.forEach((food: IFood, index: number) => {
      Object.entries(food.ingredients).forEach(([key, value]) => {
        if (value.unlockDay <= day)
          copyStore.foods[index].ingredients[key].unlocked = true;
      });
    });

    copyStore.upgrades.forEach((upgrade: IUpgrade, index: number) => {
      if (upgrade.unlockDay <= day) copyStore.upgrades[index].unlocked = true;
    });

    copyStore.gitCommands.forEach((gitCommand: IGitCommand, index: number) => {
      if (gitCommand.unlockDay <= day)
        copyStore.gitCommands[index].unlocked = true;
    });

    return copyStore;
  },
};

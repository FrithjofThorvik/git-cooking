import {
  IGitCommand,
  IIngredient,
  IStore,
  IUpgrade,
  StoreItem,
} from "types/gameDataInterfaces";
import { defaultFoods } from "./defaultFoods";
import { defaultUpgrades } from "./defaultUpgrades";
import { defaultGitCommands } from "./defaultGitCommands";
import { copyObjectWithoutRef } from "services/helpers";
import { isGitCommand, isIngredient, isUpgrade } from "services/typeGuards";

export const defaultStore: IStore = {
  foods: copyObjectWithoutRef(defaultFoods),
  upgrades: copyObjectWithoutRef(defaultUpgrades),
  gitCommands: copyObjectWithoutRef(defaultGitCommands),
  cash: 30000,
  purchase: function (purchasable: StoreItem) {
    let copy: IStore = copyObjectWithoutRef(this);

    // Purchase upgrade
    if (isUpgrade(purchasable)) {
      let upgrade: IUpgrade = purchasable;
      copy.upgrades.forEach((u) => {
        if (u.id === upgrade.id && copy.cash >= u.cost()) {
          u.level += 1;
          if (u.level === u.maxLevel) u.purchased = true;
          copy.cash -= u.cost();
        }
      });
      return copy;
    }

    // Git Command
    else if (isGitCommand(purchasable)) {
      let gitCommand: IGitCommand = purchasable;
      copy.gitCommands.forEach((g) => {
        if (g.id === gitCommand.id && copy.cash >= g.cost()) {
          g.purchased = true;
          copy.cash -= g.cost();
        }
      });
    }

    // Ingredient
    else if (isIngredient(purchasable)) {
      let ingredient: IIngredient = purchasable;
      copy.foods.forEach((f) => {
        if (f.type === ingredient.type) {
          Object.values(f.ingredients).map((i) => {
            if (i.name === ingredient.name && copy.cash >= i.cost) {
              i.purchased = true;
              copy.cash -= i.cost;
            }
          });
        }
      });
    }

    return copy;
  },
};

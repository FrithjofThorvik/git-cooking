import {
  IGitCommand,
  IIngredient,
  IPurchasable,
  IStore,
  IUpgrade,
} from "types/gameDataInterfaces";
import { defaultFoods } from "./defaultFoods";
import { defaultUpgrades } from "./defaultUpgrades";
import { defaultGitCommands } from "./defaultGitCommands";
import { copyObjectWithoutRef } from "services/helpers";

export const defaultStore: IStore = {
  foods: copyObjectWithoutRef(defaultFoods),
  upgrades: copyObjectWithoutRef(defaultUpgrades),
  gitCommands: copyObjectWithoutRef(defaultGitCommands),
  cash: 0,
  purchase: function (purchasable: IPurchasable) {
    let copy: IStore = copyObjectWithoutRef(this);

    // Purchase upgrade
    if (
      purchasable.unlocked !== undefined &&
      purchasable.gitCommandType === undefined
    ) {
      let upgrade: IUpgrade = purchasable as IUpgrade;
      copy.upgrades.forEach((u) => {
        if (u.id === upgrade.id && copy.cash >= u.cost) {
          u.purchased = true;
          copy.cash -= u.cost;
        }
      });
      return copy;
    }

    // Git Command
    else if (
      purchasable.unlocked !== undefined &&
      purchasable.gitCommandType !== undefined
    ) {
      let gitCommand: IGitCommand = purchasable as IGitCommand;
      copy.gitCommands.forEach((g) => {
        if (g.id === gitCommand.id && copy.cash >= g.cost) {
          g.purchased = true;
          copy.cash -= g.cost;
        }
      });
    }

    // Ingredient
    let ingredient: IIngredient = purchasable as IIngredient;
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
    return copy;
  },
};

import { defaultFoods } from "./defaultFoods";
import { defaultUpgrades } from "./defaultUpgrades";
import { copyObjectWithoutRef } from "services/helpers";
import { IIngredient, IStore, IUpgrade } from "types/gameDataInterfaces";

export const defaultStore: IStore = {
  foods: copyObjectWithoutRef(defaultFoods),
  upgrades: copyObjectWithoutRef(defaultUpgrades),
  cash: 0,
  purchaseIngredient: function (ingredient: IIngredient) {
    let copy: IStore = copyObjectWithoutRef(this);
    copy.foods.forEach((f) => {
      if (f.type === ingredient.type) {
        Object.values(f.ingredients).map((i) => {
          if (i.name === ingredient.name) {
            i.purchased = true;
            copy.cash -= i.cost;
          }
        });
      }
    });
    return copy;
  },
  purchaseUpgrade: function (upgrade: IUpgrade) {
    let copy: IStore = copyObjectWithoutRef(this);
    copy.upgrades.forEach((u) => {
      if (u.id === upgrade.id) {
        u.purchased = true;
        copy.cash -= u.cost;
      }
    });
    return copy;
  },
};

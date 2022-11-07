import { imgBunTop } from "assets";
import { IngredientType } from "types/enums";
import { IIngredient } from "types/gameDataInterfaces";

interface IngredientList {
  burger: {
    bunTop: IIngredient;
  };
}

export const ingredients: IngredientList = {
  burger: {
    bunTop: {
      name: "bun_top.ing",
      image: imgBunTop,
      cost: 100,
      purchased: false,
      path: "",
      type: IngredientType.BURGER,
    },
  },
};

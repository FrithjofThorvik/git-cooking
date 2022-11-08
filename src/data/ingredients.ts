import { imgBunTop, imgBunBottom, imgPaddy, imgSalad, imgOnions } from "assets";
import { IngredientType } from "types/enums";
import { IIngredient } from "types/gameDataInterfaces";

interface IngredientList {
  burger: {
    bunTop: IIngredient;
    paddy: IIngredient;
    salad: IIngredient;
    onions: IIngredient;
    bunBottom: IIngredient;
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
    paddy: {
      name: "paddy.ing",
      image: imgPaddy,
      cost: 100,
      purchased: false,
      path: "",
      type: IngredientType.BURGER,
    },
    salad: {
      name: "salad.ing",
      image: imgSalad,
      cost: 100,
      purchased: false,
      path: "",
      type: IngredientType.BURGER,
    },
    onions: {
      name: "onions.ing",
      image: imgOnions,
      cost: 100,
      purchased: false,
      path: "",
      type: IngredientType.BURGER,
    },
    bunBottom: {
      name: "bun_bottom.ing",
      image: imgBunBottom,
      cost: 100,
      purchased: false,
      path: "",
      type: IngredientType.BURGER,
    },
  },
};

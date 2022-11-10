import {
  imgBunTop,
  imgBunBottom,
  imgPaddy,
  imgSalad,
  imgOnions,
  imgFries,
  imgCheeseFries,
} from "assets";
import { IngredientType } from "types/enums";
import { IBurger, IFries } from "types/gameDataInterfaces";

interface IFoodItemList {
  burger: IBurger;
  fries: IFries;
}

export const foodItems: IFoodItemList = {
  burger: {
    bunTop: {
      name: "bun_top.ing",
      image: imgBunTop,
      cost: 100,
      purchased: true,
      path: "ingredients/burger/bun_top.ing",
      type: IngredientType.BURGER,
    },
    paddy: {
      name: "paddy.ing",
      image: imgPaddy,
      cost: 100,
      purchased: true,
      path: "ingredients/burger/paddy.ing",
      type: IngredientType.BURGER,
    },
    salad: {
      name: "salad.ing",
      image: imgSalad,
      cost: 100,
      purchased: false,
      path: "ingredients/burger/salad.ing",
      type: IngredientType.BURGER,
    },
    onions: {
      name: "onions.ing",
      image: imgOnions,
      cost: 100,
      purchased: false,
      path: "ingredients/burger/onions.ing",
      type: IngredientType.BURGER,
    },
    bunBottom: {
      name: "bun_bottom.ing",
      image: imgBunBottom,
      cost: 100,
      purchased: true,
      path: "ingredients/burger/bun_bottom.ing",
      type: IngredientType.BURGER,
    },
  },
  fries: {
    cheese: {
      name: "cheese_fries.ing",
      image: imgCheeseFries,
      cost: 100,
      purchased: true,
      path: "",
      type: IngredientType.EXTRA,
    },
    normal: {
      name: "fries.ing",
      image: imgFries,
      cost: 100,
      purchased: true,
      path: "",
      type: IngredientType.EXTRA,
    },
  },
};

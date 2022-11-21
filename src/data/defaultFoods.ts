import { v4 } from "uuid";

import {
  imgBunBottom,
  imgBunTop,
  imgCheeseFries,
  imgFries,
  imgOnions,
  imgPaddy,
  imgSalad,
} from "assets";
import { foodBuilder } from "services/foodBuilders";
import { IngredientType } from "types/enums";
import { IBurger, IFood, IFries } from "types/foodInterfaces";

export const defaultFoods: IFood[] = [
  {
    id: "1",
    name: "Burger",
    type: IngredientType.BURGER,
    unlocked: true,
    ingredients: {
      bunTop: {
        id: v4(),
        name: "bun_top.ing",
        image: imgBunTop,
        cost: 100,
        purchased: true,
        type: IngredientType.BURGER,
      },
      paddy: {
        id: v4(),
        name: "paddy.ing",
        image: imgPaddy,
        cost: 100,
        purchased: true,
        type: IngredientType.BURGER,
      },
      salad: {
        id: v4(),
        name: "salad.ing",
        image: imgSalad,
        cost: 100,
        purchased: false,
        type: IngredientType.BURGER,
      },
      onions: {
        id: v4(),
        name: "onions.ing",
        image: imgOnions,
        cost: 100,
        purchased: false,
        type: IngredientType.BURGER,
      },
      bunBottom: {
        id: v4(),
        name: "bun_bottom.ing",
        image: imgBunBottom,
        cost: 100,
        purchased: true,
        type: IngredientType.BURGER,
      },
    },
    builder: function () {
      return foodBuilder.buildBurger(this.ingredients as IBurger);
    },
  },
  {
    id: "2",
    name: "Fries",
    unlocked: true,
    type: IngredientType.EXTRA,
    ingredients: {
      cheese: {
        id: v4(),
        name: "cheese_fries.ing",
        image: imgCheeseFries,
        cost: 100,
        purchased: true,
        type: IngredientType.EXTRA,
      },
      normal: {
        id: v4(),
        name: "fries.ing",
        image: imgFries,
        cost: 100,
        purchased: true,
        type: IngredientType.EXTRA,
      },
    },
    builder: function () {
      return foodBuilder.buildFries(this.ingredients as IFries);
    },
  },
];

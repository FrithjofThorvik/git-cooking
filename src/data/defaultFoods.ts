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
        name: "bun top",
        image: imgBunTop,
        cost: 100,
        default: true,
        unlocked: true,
        unlockDay: 0,
        purchased: true,
        type: IngredientType.BURGER,
        useCost: 10,
      },
      paddy: {
        id: v4(),
        name: "paddy",
        image: imgPaddy,
        cost: 100,
        default: true,
        unlocked: true,
        unlockDay: 0,
        purchased: true,
        type: IngredientType.BURGER,
        useCost: 15,
      },
      salad: {
        id: v4(),
        name: "salad",
        image: imgSalad,
        cost: 100,
        purchased: false,
        unlocked: false,
        unlockDay: 2,
        type: IngredientType.BURGER,
        useCost: 5,
      },
      onions: {
        id: v4(),
        name: "onions",
        image: imgOnions,
        cost: 100,
        purchased: false,
        unlocked: false,
        unlockDay: 3,
        type: IngredientType.BURGER,
        useCost: 5,
      },
      bunBottom: {
        id: v4(),
        name: "bun bottom",
        image: imgBunBottom,
        cost: 100,
        default: true,
        unlocked: true,
        unlockDay: 0,
        purchased: true,
        type: IngredientType.BURGER,
        useCost: 10,
      },
    },
    builder: function (difficulty) {
      return foodBuilder.buildBurger(this.ingredients as IBurger, difficulty);
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
        name: "cheese fries",
        image: imgCheeseFries,
        cost: 100,
        purchased: false,
        unlocked: false,
        unlockDay: 2,
        type: IngredientType.EXTRA,
        useCost: 15,
      },
      normal: {
        id: v4(),
        name: "fries",
        image: imgFries,
        cost: 100,
        purchased: true,
        default: true,
        unlocked: true,
        unlockDay: 0,
        type: IngredientType.EXTRA,
        useCost: 10,
      },
    },
    builder: function (difficulty) {
      return foodBuilder.buildFries(this.ingredients as IFries, difficulty);
    },
  },
];

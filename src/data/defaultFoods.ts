import { v4 } from "uuid";

import {
  imgBacon,
  imgBunBottom,
  imgBunTop,
  imgCheeseFries,
  imgFries,
  imgNachos,
  imgOnionRings,
  imgOnions,
  imgPaddy,
  imgSalad,
  imgTomato,
} from "assets/foods";
import { foodBalancing } from "./balancing";
import { foodBuilder } from "services/foodBuilders";
import { IngredientType } from "types/enums";
import { IBurger, IExtra, IFood } from "types/foodInterfaces";

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
        ...foodBalancing.bunTop,
        default: true,
        unlocked: true,
        purchased: true,
        type: IngredientType.BURGER,
      },
      paddy: {
        id: v4(),
        name: "paddy",
        image: imgPaddy,
        ...foodBalancing.paddy,
        default: true,
        unlocked: true,
        purchased: true,
        type: IngredientType.BURGER,
      },
      salad: {
        id: v4(),
        name: "salad",
        image: imgSalad,
        ...foodBalancing.salad,
        purchased: false,
        unlocked: false,
        type: IngredientType.BURGER,
      },
      bacon: {
        id: v4(),
        name: "bacon",
        image: imgBacon,
        ...foodBalancing.bacon,
        purchased: false,
        unlocked: false,
        type: IngredientType.BURGER,
      },
      onions: {
        id: v4(),
        name: "onions",
        image: imgOnions,
        ...foodBalancing.onions,
        purchased: false,
        unlocked: false,
        type: IngredientType.BURGER,
      },
      tomato: {
        id: v4(),
        name: "tomato",
        image: imgTomato,
        ...foodBalancing.tomato,
        purchased: false,
        unlocked: false,
        type: IngredientType.BURGER,
      },
      bunBottom: {
        id: v4(),
        name: "bun bottom",
        image: imgBunBottom,
        ...foodBalancing.bunBottom,
        default: true,
        unlocked: true,
        purchased: true,
        type: IngredientType.BURGER,
      },
    },
    builder: function (difficulty) {
      return foodBuilder.buildBurger(this.ingredients as IBurger, difficulty);
    },
  },
  {
    id: "2",
    name: "Extra",
    unlocked: true,
    type: IngredientType.EXTRA,
    ingredients: {
      cheese_fries: {
        id: v4(),
        name: "cheese fries",
        image: imgCheeseFries,
        ...foodBalancing.cheeseFries,
        purchased: false,
        unlocked: false,
        type: IngredientType.EXTRA,
        isSingle: true,
      },
      normal_fries: {
        id: v4(),
        name: "fries",
        image: imgFries,
        ...foodBalancing.fries,
        purchased: true,
        default: true,
        unlocked: true,
        type: IngredientType.EXTRA,
        isSingle: true,
      },
      onion_rings: {
        id: v4(),
        name: "onion rings",
        image: imgOnionRings,
        ...foodBalancing.onionRings,
        purchased: false,
        unlocked: false,
        type: IngredientType.EXTRA,
        isSingle: true,
      },
      nachos: {
        id: v4(),
        name: "nachos",
        image: imgNachos,
        ...foodBalancing.nachos,
        purchased: false,
        unlocked: false,
        type: IngredientType.EXTRA,
        isSingle: true,
      },
    },
    builder: function (difficulty) {
      return foodBuilder.buildExtra(this.ingredients as IExtra, difficulty);
    },
  },
];

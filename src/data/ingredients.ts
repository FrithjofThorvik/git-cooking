import { imgBunTop, imgBunBottom, imgPaddy, imgSalad, imgOnions, imgFries, imgCheeseFries } from "assets";
import { IngredientType } from "types/enums";
import { IIngredient } from "types/gameDataInterfaces";

interface IFoodItemList {
  burger: {
    unlocked: boolean;
    ingredients: {
      bunTop: IIngredient;
      paddy: IIngredient;
      salad: IIngredient;
      onions: IIngredient;
      bunBottom: IIngredient;
    };
  };
  fries: {
    unlocked: boolean;
    ingredients: {
      cheese: IIngredient;
      normal: IIngredient;
    };
  };
}

export const foodItems: IFoodItemList = {
  burger: {
    unlocked: true,
    ingredients: {
      bunTop: {
        name: "bun_top.ing",
        image: imgBunTop,
        cost: 100,
        purchased: true,
        path: "",
        type: IngredientType.BURGER,
      },
      paddy: {
        name: "paddy.ing",
        image: imgPaddy,
        cost: 100,
        purchased: true,
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
        purchased: true,
        path: "",
        type: IngredientType.BURGER,
      },
    },
  },
  fries: {
    unlocked: true,
    ingredients: {
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
  },
};

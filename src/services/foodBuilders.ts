import { IBurger, IFries, IIngredient } from "types/gameDataInterfaces";
import { randomIntFromInterval } from "./helpers";

class FoodBuilder {
  public buildBurger = (burger: IBurger): IIngredient[] => {
    // const toppings = [burger.onions, burger.salad, burger.paddy];
    // const unlockedToppings = toppings.filter((i) => i.purchased);

    return [burger.bunTop, burger.paddy, burger.bunBottom];
  };

  public buildFries = (fries: IFries): IIngredient[] => {
    return [fries.cheese];
  };
}

export const foodBuilder = new FoodBuilder();

import { IIngredient } from "types/gameDataInterfaces";
import { IBurger, IFries } from "types/foodInterfaces";

class FoodBuilder {
  public buildBurger = (burger: IBurger): IIngredient[] => {

    return [burger.bunTop, burger.paddy, burger.bunBottom];
  };

  public buildFries = (fries: IFries): IIngredient[] => {
    return [fries.cheese];
  };
}

export const foodBuilder = new FoodBuilder();

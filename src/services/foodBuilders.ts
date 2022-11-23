import { IIngredient } from "types/gameDataInterfaces";
import { IBurger, IFries } from "types/foodInterfaces";
import { randomIntFromInterval } from "./helpers";

class FoodBuilder {
  public buildBurger = (burger: IBurger): IIngredient[] => {
    let availableIngredients = Object.values(burger).filter(
      (i) =>
        i.id !== burger.bunBottom.id && i.id !== burger.bunTop.id && i.purchased
    );
    const nrItems = randomIntFromInterval(1, availableIngredients.length);

    let chosenItems: IIngredient[] = [burger.bunTop];
    for (let i = 0; i < nrItems; i++) {
      const newItemIndex = randomIntFromInterval(
        0,
        availableIngredients.length - 1
      );
      const newItem = availableIngredients.at(newItemIndex);
      newItem && chosenItems.push(newItem);
    }
    chosenItems.push(burger.bunBottom);

    return chosenItems;
  };

  public buildFries = (fries: IFries): IIngredient[] => {
    return [fries.cheese];
  };
}

export const foodBuilder = new FoodBuilder();

import { Difficulty } from "types/enums";
import { IIngredient } from "types/gameDataInterfaces";
import { IBurger, IExtra } from "types/foodInterfaces";
import { randomIntFromInterval } from "./helpers";

class FoodBuilder {
  public buildBurger = (
    burger: IBurger,
    difficulty: Difficulty
  ): IIngredient[] => {
    let availableIngredients = Object.values(burger).filter(
      (i) => i.id !== burger.bunBottom.id && i.id !== burger.bunTop.id
    );
    let nrItems = 0;

    switch (difficulty) {
      case Difficulty.EASY:
        // only purchased items available
        availableIngredients = availableIngredients.filter((i) => i.purchased);
        nrItems = randomIntFromInterval(1, 2);
        break;
      case Difficulty.NORMAL:
        availableIngredients = availableIngredients.filter((i) => i.purchased);
        nrItems = randomIntFromInterval(1, 3);
        break;
      case Difficulty.HARD:
        // all unlocked items available
        availableIngredients = availableIngredients.filter((i) => i.unlocked);
        nrItems = randomIntFromInterval(2, 4);
        break;
    }

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

  public buildExtra = (
    extra: IExtra,
    difficulty: Difficulty
  ): IIngredient[] => {
    let availableItems = Object.values(extra);

    switch (difficulty) {
      case Difficulty.EASY:
        // only purchased items available
        availableItems = availableItems.filter((i) => i.purchased);
        break;
      case Difficulty.NORMAL:
        availableItems = availableItems.filter((i) => i.purchased);
        break;
      case Difficulty.HARD:
        // all unlocked items available
        availableItems = availableItems.filter((i) => i.unlocked);
        break;
    }

    const choosenItemIndex = randomIntFromInterval(
      0,
      availableItems.length - 1
    );

    const choosenItem = availableItems.at(choosenItemIndex);
    if (choosenItem) return [choosenItem];

    return [extra.normal_fries];
  };
}

export const foodBuilder = new FoodBuilder();

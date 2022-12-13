import { IIngredient } from "./gameDataInterfaces";
import { Difficulty, IngredientType } from "./enums";

export interface IFood {
  id: string;
  name: string;
  unlocked: boolean;
  type: IngredientType;
  ingredients: FoodType;
  builder: (difficulty: Difficulty) => IIngredient[];
}

export type FoodType = IBurger | IFries;

export interface FoodDict {
  [key: string]: IIngredient;
}

export interface IBurger extends FoodDict {
  bunTop: IIngredient;
  paddy: IIngredient;
  salad: IIngredient;
  onions: IIngredient;
  bunBottom: IIngredient;
}

export interface IFries extends FoodDict {
  cheese: IIngredient;
  normal: IIngredient;
}

import { IngredientType } from "./enums";
import { IIngredient } from "./gameDataInterfaces";

export interface IFood {
  id: string;
  name: string;
  unlocked: boolean;
  type: IngredientType;
  ingredients: FoodType;
  builder: () => IIngredient[];
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

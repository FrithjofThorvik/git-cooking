import { v4 } from "uuid";
import {
  IIngredient,
  IOrder,
  IOrderItem,
  Item,
} from "types/gameDataInterfaces";
import { IngredientType } from "types/enums";

export const getNewOrderItem = (order: IOrder, name: string): IOrderItem => {
  return {
    id: v4(),
    name: name,
    path: `orders/${order.name}/${name}`,
    orderId: order.id,
    type: IngredientType.BURGER,
    ingredients: [],
  };
};

export const doesOrderItemExist = (order: IOrder, name: string): boolean => {
  return order.items.map((i) => i.name).includes(name);
};

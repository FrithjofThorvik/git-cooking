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

export const getOrderFromOrderItem = (
  orders: IOrder[],
  orderItem: IOrderItem
): IOrder | null => {
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id === orderItem.orderId) return orders[i];
  }
  return null;
};

export const getIndexOfOrder = (orders: IOrder[], order: IOrder): number => {
  return orders.findIndex((o) => o.id === order.id);
};

export const getIndexOfOrderItem = (
  order: IOrder,
  orderItem: IOrderItem
): number => {
  return order.items.findIndex((i) => i.id === orderItem.id);
};

export const getOrderItemsFromIds = (orders: IOrder[], ids: string[]) => {
  let selectedOrderItems: IOrderItem[] = [];

  orders.forEach((o) => {
    o.items.forEach((i) => {
      if (ids.includes(i.id)) selectedOrderItems.push(i);
    });
  });

  return selectedOrderItems;
};

export const getOrderItemFromId = (orders: IOrder[], id: string) => {
  let order: IOrderItem | null = null;
  orders.forEach((o) => {
    o.items.forEach((i) => {
      if (i.id === id) {
        order = i;
      }
    });
  });
  return order;
};

export const getOrderNameFromId = (orders: IOrder[], id: string) => {
  let name = "";
  orders.forEach((o) => {
    if (o.id === id) name = o.name;
  });
  return name;
};

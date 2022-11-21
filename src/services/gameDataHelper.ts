import { IGitTree } from "types/gitInterfaces";
import { objectsEqual } from "./helpers";
import { IngredientType } from "types/enums";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";

export const createNewOrderItem = (order: IOrder, name: string): IOrderItem => {
  return {
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
  return order.items.findIndex((i) => i.path === orderItem.path);
};

export const getOrderItemsFromPaths = (orders: IOrder[], paths: string[]) => {
  let selectedOrderItems: IOrderItem[] = [];

  orders.forEach((o) => {
    o.items.forEach((i) => {
      if (paths.includes(i.path)) selectedOrderItems.push(i);
    });
  });

  return selectedOrderItems;
};

export const getOrderItemFromPath = (orders: IOrder[], path: string) => {
  let order: IOrderItem | null = null;
  orders.forEach((o) => {
    o.items.forEach((i) => {
      if (i.path === path) {
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

export const compareOrders = (
  createdItems: IOrderItem[],
  orderItems: IOrderItem[]
) => {
  let similarity = 0;

  createdItems.forEach((createdItem) => {
    const highestMatch = orderItems.reduce((max, orderItem) => {
      let total = 0;
      for (let i = 0; i < createdItem.ingredients.length; i++) {
        const createdItemIngredient = createdItem.ingredients.at(i);
        const orderItemIngredient = orderItem.ingredients.at(i);
        if (createdItemIngredient && orderItemIngredient)
          objectsEqual(createdItemIngredient, orderItemIngredient) &&
            (total += 1);
      }

      total /= orderItem.ingredients.length;
      return total > max ? total : max;
    }, 0);

    similarity += highestMatch;
  });

  similarity /= orderItems.length;
  return similarity;
};

export const calculateRevenueAndCost = (git: IGitTree) => {
  const baseOrderValue = 30;
  const baseOrderCost = 5;
  let totalOrders = 0;
  let totalPercentage = 0;
  let totalCommitedOrders = 0;
  let totalUncommitedOrders = 0;

  const parentCommit = git.getHeadCommit();
  const prevDirectory = parentCommit?.directory;

  git.workingDirectory.orders.map((order) => {
    totalOrders += 1;
    const committedOrder = prevDirectory?.orders.find((o) => o.id === order.id);

    if (committedOrder) {
      const percentageCompleted = Math.round(
        compareOrders(committedOrder.items, order.orderItems) * 100
      );
      totalPercentage += percentageCompleted;
      totalCommitedOrders += 1;
    } else {
      totalUncommitedOrders += 1;
    }
  });

  const averagePercentage = totalPercentage / totalOrders;
  const revenue = Math.round(
    totalCommitedOrders * baseOrderValue * averagePercentage
  );
  const cost = Math.round(totalCommitedOrders * baseOrderCost);
  return { revenue, cost };
};

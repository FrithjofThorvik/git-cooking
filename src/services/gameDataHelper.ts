import {
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { ISummaryStats } from "types/interfaces";
import { IngredientType } from "types/enums";

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
  return order.createdItems.map((i) => i.name).includes(name);
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
  return order.createdItems.findIndex((i) => i.path === orderItem.path);
};

export const getOrderItemsFromPaths = (orders: IOrder[], paths: string[]) => {
  let selectedOrderItems: IOrderItem[] = [];

  orders.forEach((o) => {
    o.createdItems.forEach((i) => {
      if (paths.includes(i.path)) selectedOrderItems.push(i);
    });
  });

  return selectedOrderItems;
};

export const getOrderItemFromPath = (orders: IOrder[], path: string) => {
  let order: IOrderItem | null = null;
  orders.forEach((o) => {
    o.createdItems.forEach((i) => {
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

const copyArrWithoutRowAndCol = (arr: number[][], row: number, col: number) => {
  let newArr = arr.map((a) => {
    let b = a.slice(0);
    b.splice(col, 1);
    return b;
  });
  newArr.splice(row, 1);
  return newArr;
};

const maximumSum = (mat: number[][], score = 0) => {
  let highscore = 0;
  for (let row = 0; row < mat.length; row++) {
    for (let col = 0; col < mat[row].length; col++) {
      let newScore = score + mat[row][col];
      if (mat[row].length > 1 && mat.length > 1) {
        let newMat = copyArrWithoutRowAndCol(mat, row, col);
        let newHighscore = maximumSum(newMat, newScore);
        if (newHighscore > highscore) highscore = newHighscore;
      } else {
        if (newScore > highscore) highscore = newScore;
      }
    }
  }
  return highscore;
};

const similarityPercentage = (a: IIngredient[], b: IIngredient[]) => {
  const ingredientsA = a.map((i) => i.id);
  const ingredientsB = b.map((i) => i.id);
  const includedPoints =
    (0.5 * ingredientsA.filter((idA) => ingredientsB.includes(idA)).length) /
    Math.max(ingredientsA.length, ingredientsB.length);

  const samePosPoints =
    (0.5 * ingredientsA.filter((idA, i) => ingredientsB.at(i) === idA).length) /
    Math.max(ingredientsA.length, ingredientsB.length);

  const extraIngredientCount = ingredientsA.length - ingredientsB.length;
  const tooManyIngredientsReductionPoints =
    extraIngredientCount > 0 ? extraIngredientCount * 0.15 : 0;

  const percentage =
    100 * (includedPoints + samePosPoints - tooManyIngredientsReductionPoints);
  return Math.max(percentage, 0);
};

const calculateOrderScores = (cItems: IOrderItem[], oItems: IOrderItem[]) => {
  return cItems.map((c) => {
    let percentageArray: number[] = [];
    oItems.forEach((oItem) => {
      percentageArray.push(
        similarityPercentage(c.ingredients, oItem.ingredients)
      );
    });
    return percentageArray;
  });
};

export const compareOrders = (
  createdItems: IOrderItem[],
  orderItems: IOrderItem[]
) => {
  const orderScores = calculateOrderScores(createdItems, orderItems);
  return (
    maximumSum(orderScores) / Math.max(createdItems.length, orderItems.length)
  );
};

export const calculateRevenueAndCost = (
  gameData: IGitCooking
): ISummaryStats => {
  const git = gameData.git;
  const profitMarginMultiplier = 1.25;
  const revenueMultiplier = gameData.stats.revenueMultiplier.get(
    gameData.store.upgrades
  );
  const useCostReduction = gameData.stats.costReductionMultiplier.get(
    gameData.store.upgrades
  );

  let baseRevenue = 0;
  let baseCost = 0;
  let avgPercentage = 0;
  let bonusFromPercentage = 0;
  let bonusFromMultiplier = 0;
  let bonusFromCostReduction = 0;

  const parentCommit = git.getHeadCommit();
  const prevDirectory = parentCommit?.directory;

  prevDirectory?.orders.forEach((commitedOrder) => {
    const percentageCompleted = commitedOrder.percentageCompleted;
    let orderCost = 0;
    commitedOrder.createdItems.forEach((item) => {
      item.ingredients.forEach(
        (ingredient) => (orderCost += ingredient.useCost)
      );
    });
    const orderRevenue = orderCost * profitMarginMultiplier;

    baseCost += orderCost;
    baseRevenue += orderRevenue;
    avgPercentage += percentageCompleted / prevDirectory.orders.length;
    bonusFromPercentage +=
      orderRevenue - orderRevenue * (percentageCompleted / 100);
    bonusFromMultiplier += orderRevenue * revenueMultiplier - orderRevenue;
    bonusFromCostReduction += orderCost - orderCost * useCostReduction;
  });

  const totalRevenue = baseRevenue + bonusFromMultiplier + bonusFromPercentage;
  const totalCost = baseCost - bonusFromCostReduction;
  const profit = totalRevenue - totalCost;

  return {
    profit,
    totalCost,
    totalRevenue,
    baseRevenue,
    baseCost,
    revenueMultiplier,
    useCostReduction,
    avgPercentage,
    bonusFromCostReduction,
    bonusFromMultiplier,
    bonusFromPercentage,
  };
};

export const calculateOrderTimerPercentage = (
  currentTime: number,
  orderStartTime: number,
  orderEndTime: number
) => {
  return (
    ((currentTime - orderStartTime) / (orderEndTime - orderStartTime)) * 100
  );
};

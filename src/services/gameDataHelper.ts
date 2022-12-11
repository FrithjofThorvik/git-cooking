import {
  IGitCommand,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { ISummaryStats } from "types/interfaces";
import { GitCommandType, IngredientType } from "types/enums";

export const createNewOrderItem = (order: IOrder, name: string): IOrderItem => {
  return {
    name: name,
    path: `orders/${order.name}/${name}`,
    orderId: order.id,
    type: IngredientType.BURGER,
    ingredients: [],
  };
};

export const doesOrderItemExistOnOrder = (
  createdItems: IOrderItem[],
  name: string,
  order: IOrder
): boolean => {
  return createdItems
    .filter((i) => i.orderId === order.id)
    .map((i) => i.name)
    .includes(name);
};

export const getOrderItemsFromPaths = (
  createdItems: IOrderItem[],
  paths: string[]
) => {
  let selectedOrderItems: IOrderItem[] = [];

  createdItems.forEach((i) => {
    if (paths.includes(i.path)) selectedOrderItems.push(i);
  });

  return selectedOrderItems;
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

export const compareOrders = (createdItems: IOrderItem[], order: IOrder) => {
  const relatedCreatedItems = createdItems.filter(
    (i) => i.orderId === order.id
  );
  const orderScores = calculateOrderScores(
    relatedCreatedItems,
    order.orderItems
  );
  return (
    maximumSum(orderScores) /
    Math.max(relatedCreatedItems.length, order.orderItems.length)
  );
};

export const calculateRevenueAndCost = (
  gameData: IGitCooking
): ISummaryStats => {
  const git = gameData.git;
  const profitMarginMultiplier = 1.25;
  const accuracyMultiplier = 0.25;
  const baseEarlyFinishEarning = 100;
  const revenueMultiplier = gameData.stats.revenueMultiplier.value;
  const useCostReduction = gameData.stats.costReductionMultiplier.value;
  const dayLength = gameData.stats.dayLength.value;
  const endedDayTime = gameData.states.endedDayTime;

  let baseRevenue = 0;
  let baseCost = 0;
  let avgPercentage = 0;
  let bonusFromPercentage = 0;
  let maxBonusFromPercentage = 0;
  let bonusFromMultiplier = 0;
  let bonusFromCostReduction = 0;
  let bonusFromEndedDayTime = 0;
  let maxBonusFromEndedDayTime =
    dayLength - endedDayTime > 0 && endedDayTime
      ? (1 - endedDayTime / dayLength) * baseEarlyFinishEarning
      : 0;

  const parentCommit = git.getHeadCommit();
  const prevDirectory = parentCommit?.directory;

  if (prevDirectory) {
    gameData.orderService.getAllOrders().forEach((order) => {
      const percentageCompleted = order.percentageCompleted;
      let orderCost = 0;
      prevDirectory.createdItems.forEach((item) => {
        item.ingredients.forEach(
          (ingredient) => (orderCost += ingredient.useCost)
        );
      });
      const orderRevenue = orderCost * profitMarginMultiplier;

      baseCost += orderCost;
      baseRevenue += orderRevenue;
      avgPercentage +=
        percentageCompleted / gameData.orderService.getAllOrders().length;
      bonusFromPercentage +=
        orderRevenue * (percentageCompleted / 100) * accuracyMultiplier;
      maxBonusFromPercentage += orderRevenue * (100 / 100) * accuracyMultiplier;
      bonusFromMultiplier += orderRevenue * revenueMultiplier - orderRevenue;
      bonusFromCostReduction += orderCost - orderCost * useCostReduction;
    });
  }
  bonusFromEndedDayTime = (maxBonusFromEndedDayTime * avgPercentage) / 100;

  const totalRevenue =
    baseRevenue +
    bonusFromMultiplier +
    bonusFromPercentage +
    bonusFromEndedDayTime;
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
    bonusFromEndedDayTime,
    maxBonusFromPercentage,
    maxBonusFromEndedDayTime,
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

export const isGitCmdPurchased = (
  gitCommands: IGitCommand[],
  gitCommandType: GitCommandType
) => {
  let isPurchased = false;
  gitCommands
    .filter((c) => c.gitCommandType === gitCommandType)
    .forEach((c) => (isPurchased = c.purchased));
  return isPurchased;
};

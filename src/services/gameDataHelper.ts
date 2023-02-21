import {
  IGitCommand,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { IRemoteBranch } from "types/gitInterfaces";
import { ISummaryBranch, ISummaryStats } from "types/interfaces";
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
  gameData: IGitCooking,
  branches: IRemoteBranch[]
): ISummaryStats => {
  const profitMarginMultiplier = 1.25;
  const accuracyMultiplier = 0.25;
  const baseEarlyFinishEarning = 100;
  const revenueMultiplier = gameData.stats.revenueMultiplier.value;
  const useCostReduction = gameData.stats.useCostReductionMultiplier.value;
  const dayLength = gameData.stats.dayLength.value;
  const endedDayTime = gameData.states.endedDayTime;

  const summaryBranches: ISummaryBranch[] = branches.map((b) => {
    let maxBonusFromEndedDayTime = baseEarlyFinishEarning;
    let ordersCompleted = 0;
    const calculateSum = () => {
      const partSum = (orders: IOrder[], max: boolean, isMain: boolean) => {
        let baseRevenue = 0;
        let baseCost = 0;
        let avgPercentage = 0;
        let totalRevenue = 0;
        let totalCost = 0;
        let profit = 0;
        let costReduction = 0;
        let multiplierBonus = 0;
        let percentageBonus = 0;
        let bonusFromEndedDayTime = 0;

        orders.forEach((order) => {
          const orderPercentageCompleted = max
            ? 100
            : order.percentageCompleted;

          // Calculate order cost from ingredients used to make order
          let orderCost = 0;
          gameData.git
            .getActiveProject()
            ?.remote.getPushedItems(b.name)
            .forEach((item) => {
              if (item.orderId === order.id)
                item.ingredients.forEach(
                  (ingredient) => (orderCost += ingredient.useCost)
                );
            });

          // Calculate order price from ingredients in order
          let orderPrice = 0;
          order.orderItems.forEach((item) => {
            item.ingredients.forEach(
              (ingredient) => (orderPrice += ingredient.useCost)
            );
          });

          // Calculate order revenue for ordered item
          const expectedOrderRevenue = orderPrice * profitMarginMultiplier;

          let orderRevenue = 0;
          // assuming you have completed something of an order
          if (orderPercentageCompleted > 0 && !max) {
            if (0 < orderCost && orderCost < orderPrice)
              // If you sell an incomplete item -> only get money calculated with the cost of the item made
              orderRevenue = orderCost * profitMarginMultiplier;
            else orderRevenue = expectedOrderRevenue; // Receive full profit for item
            ordersCompleted += 1;
          }
          orderCost = max ? orderPrice : orderCost;
          orderRevenue = max ? expectedOrderRevenue : orderRevenue;

          const orderPercentageBonus =
            ((orderRevenue * orderPercentageCompleted) / 100) *
            accuracyMultiplier;
          const orderMultiplierBonus =
            orderRevenue * revenueMultiplier - orderRevenue;
          const orderCostReduction = orderCost - orderCost * useCostReduction;
          const orderTotalRevenue =
            orderRevenue + orderPercentageBonus + orderMultiplierBonus;
          const orderTotalCost = orderCost - orderCostReduction;

          avgPercentage += orderPercentageCompleted / orders.length;
          baseRevenue += orderRevenue;
          baseCost += orderCost;
          percentageBonus += orderPercentageBonus;
          multiplierBonus += orderMultiplierBonus;
          costReduction += orderCostReduction;
          totalRevenue += orderTotalRevenue;
          totalCost += orderTotalCost;
          profit += orderTotalRevenue - orderTotalCost;
        });

        if (avgPercentage > 0) {
          bonusFromEndedDayTime = isMain
            ? max
              ? maxBonusFromEndedDayTime
              : (1 - endedDayTime / dayLength) * baseEarlyFinishEarning
            : 0;
          profit += bonusFromEndedDayTime;
          totalRevenue += bonusFromEndedDayTime;
        }

        return {
          baseRevenue,
          baseCost,
          avgPercentage,
          totalRevenue,
          totalCost,
          profit,
          costReduction,
          multiplierBonus,
          percentageBonus,
          bonusFromEndedDayTime,
        };
      };

      return {
        totalSum: partSum(b.orders, false, b.isMain || false),
        maxSum: partSum(b.orders, true, b.isMain || false),
      };
    };

    const { totalSum, maxSum } = calculateSum();

    return {
      name: b.name,
      isMain: b.isMain,
      stats: {
        maxProfit: maxSum.profit,
        profit: totalSum.profit,
        totalCost: totalSum.totalCost,
        totalRevenue: totalSum.totalRevenue,
        baseRevenue: totalSum.baseRevenue,
        baseCost: totalSum.baseCost,
        revenueMultiplier,
        useCostReduction,
        avgPercentage: totalSum.avgPercentage,
        bonusFromCostReduction: totalSum.costReduction,
        bonusFromMultiplier: totalSum.multiplierBonus,
        bonusFromPercentage: totalSum.percentageBonus,
        bonusFromEndedDayTime: totalSum.bonusFromEndedDayTime,
        maxBonusFromPercentage: maxSum.percentageBonus,
        maxBonusFromEndedDayTime: maxSum.bonusFromEndedDayTime,
        orderCount: b.orders.length,
        ordersCompleted,
        itemCount: b.stats.itemCount,
        itemsMadeCount:
          gameData.git.getActiveProject()?.remote.getPushedItems(b.name)
            .length || 0,
      },
    };
  });

  return {
    branches: summaryBranches,
    totalProfit: summaryBranches
      .filter((b) => b.isMain)
      .reduce((totalProfit, b) => totalProfit + b.stats.profit, 0),
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

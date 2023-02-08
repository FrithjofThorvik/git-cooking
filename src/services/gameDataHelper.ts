import {
  IGitCommand,
  IGitCooking,
  IIngredient,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { IRemoteBranch } from "types/gitInterfaces";
import { ISummaryBranch, ISummaryStats } from "types/interfaces";
import { sumObjectValues } from "./helpers";
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
  const useCostReduction = gameData.stats.costReductionMultiplier.value;
  const dayLength = gameData.stats.dayLength.value;
  const endedDayTime = gameData.states.endedDayTime;

  const summaryBranches: ISummaryBranch[] = branches.map((b) => {
    interface IOrderStat {
      cost: number;
      price: number;
      percentageCompleted: number;
    }
    let maxBonusFromEndedDayTime = baseEarlyFinishEarning;

    const orderStats: IOrderStat[] = b.orders.map((order) => {
      const percentageCompleted = order.percentageCompleted;

      // Calculate order cost from ingredients used to make order
      let cost = 0;
      gameData.git
        .getActiveProject()
        ?.remote.getPushedItems(b.name)
        .forEach((item) => {
          if (item.orderId === order.id)
            item.ingredients.forEach(
              (ingredient) => (cost += ingredient.useCost)
            );
        });

      // Calculate order price from ingredients in order
      let price = 0;
      order.orderItems.forEach((item) => {
        item.ingredients.forEach((ingredient) => (price += ingredient.useCost));
      });

      return {
        cost,
        price,
        percentageCompleted,
      };
    });

    const calculateSum = (orderStats: IOrderStat[]) => {
      let baseRevenue = 0;
      let baseCost = 0;
      let avgPercentage = 0;
      let ordersCompleted = 0;

      let expectedCost = 0;
      let expectedRevenue = 0;

      const addToTotal = (oStat: IOrderStat) => {
        // Calculate order revenue for ordered item
        const expectedOrderRevenue = oStat.price * profitMarginMultiplier;

        baseCost += oStat.cost;
        expectedCost += oStat.price;
        expectedRevenue += expectedOrderRevenue;
        avgPercentage += oStat.percentageCompleted / b.orders.length;

        // assuming you have completed something of an order
        if (oStat.percentageCompleted > 0) {
          baseRevenue += expectedOrderRevenue;
          ordersCompleted += 1;
        }
      };
      orderStats.forEach(addToTotal);

      // Sums up total revenue with bonuses
      const partSum = (
        revenue: number,
        cost: number,
        percentage: number,
        max: boolean,
        isMain: boolean
      ) => {
        const calculateBonuses = (
          revenue: number,
          percentage: number,
          max: boolean,
          isMain: boolean
        ) => {
          let bonusFromEndedDayTime = isMain
            ? max
              ? maxBonusFromEndedDayTime
              : avgPercentage > 0
              ? (1 - endedDayTime / dayLength) * baseEarlyFinishEarning
              : 0
            : 0;

          const percentageBonus =
            revenue * (percentage / 100) * accuracyMultiplier;
          const multiplierBonus = revenue * revenueMultiplier - revenue;
          return {
            bonusFromEndedDayTime,
            percentageBonus,
            multiplierBonus,
          };
        };

        const calculateReductions = (cost: number) => {
          const costReduction = cost - cost * useCostReduction;
          return {
            costReduction,
          };
        };

        const bonuses = calculateBonuses(revenue, percentage, max, isMain);
        const reductions = calculateReductions(cost);

        const totalRevenue = revenue + sumObjectValues(bonuses);

        const totalCost = cost - sumObjectValues(reductions);

        const profit = totalRevenue - totalCost;
        return {
          baseRevenue,
          baseCost,
          avgPercentage,
          totalRevenue,
          totalCost,
          profit,
          costReduction: reductions.costReduction,
          multiplierBonus: bonuses.multiplierBonus,
          percentageBonus: bonuses.percentageBonus,
          bonusFromEndedDayTime: bonuses.bonusFromEndedDayTime,
        };
      };

      return {
        totalSum: partSum(
          baseRevenue,
          baseCost,
          avgPercentage,
          false,
          b.isMain || false
        ),
        maxSum: partSum(
          expectedRevenue,
          expectedCost,
          100,
          true,
          b.isMain || false
        ),
        ordersCompleted,
      };
    };

    const { totalSum, maxSum, ordersCompleted } = calculateSum(orderStats);

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
        maxBonusFromEndedDayTime,
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

import { v4 } from "uuid";

import { IFood } from "types/foodInterfaces";
import { Difficulty } from "types/enums";
import { IProject, IRemoteBranch } from "types/gitInterfaces";
import { femaleNames, maleNames } from "data/names";
import { femaleImages, maleImages } from "assets/avatars";
import { IGitCooking, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef, randomIntFromInterval } from "./helpers";
import { defaultCommit } from "data/defaultGitTree";

class OrderGenerator {
  private getNumberOfItems = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return randomIntFromInterval(1, 2);
      case Difficulty.NORMAL:
        return randomIntFromInterval(1, 3);
      case Difficulty.HARD:
        return randomIntFromInterval(2, 4);
    }
  };

  private getNumberOfOrders = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return randomIntFromInterval(1, 2);
      case Difficulty.NORMAL:
        return randomIntFromInterval(2, 3);
      case Difficulty.HARD:
        return randomIntFromInterval(3, 4);
    }
  };

  private getOrderNameAndImage = (
    existingOrderNames: string[],
    existingImages: string[]
  ) => {
    const isFemale = Boolean(randomIntFromInterval(0, 1));

    const unusedNames = isFemale
      ? femaleNames.filter((n) => !existingOrderNames.includes(n))
      : maleNames.filter((n) => !existingOrderNames.includes(n));
    const unusedImages = isFemale
      ? femaleImages.filter((i) => !existingImages.includes(i))
      : maleImages.filter((i) => !existingImages.includes(i));

    const orderName =
      unusedNames[randomIntFromInterval(0, unusedNames.length - 1)];
    const orderImage =
      unusedImages[randomIntFromInterval(0, unusedImages.length - 1)];

    return { orderName, orderImage };
  };

  private chooseItems = (items: IFood[], difficulty: Difficulty): IFood[] => {
    const nrItems = this.getNumberOfItems(difficulty);

    let choosenItems = [];
    for (let i = 0; i < nrItems; i++) {
      // Choose a random item
      const newItemIndex = randomIntFromInterval(0, items.length - 1);
      const newItem = items.at(newItemIndex);
      newItem && choosenItems.push(newItem);
    }

    return choosenItems;
  };

  private generateRandomOrder = (
    items: IFood[],
    existingOrderNames: string[],
    existingImages: string[],
    difficulty: Difficulty
  ): IOrder => {
    const orderId = v4();
    const { orderName, orderImage } = this.getOrderNameAndImage(
      existingOrderNames,
      existingImages
    );
    const pathPrefx = `orders/${orderName}`;

    // Choose which and how many items
    const choosenItems = this.chooseItems(items, difficulty);

    // Generate the orderItems
    const orderItems: IOrderItem[] = choosenItems.map((item) => {
      return {
        name: item.name,
        orderId: orderId,
        path: `${pathPrefx}/${item.name}`,
        type: item.type,
        ingredients: item.builder(difficulty),
      };
    });

    // Return new order
    return {
      id: orderId,
      name: orderName,
      image: orderImage,
      isAvailable: false,
      isCreated: false,
      orderItems: orderItems,
      percentageCompleted: 0,
    };
  };

  public generateNewOrder = (
    gameData: IGitCooking,
    orders: IOrder[],
    difficulty: Difficulty
  ): IOrder => {
    // Filter out locked items
    const unlockedItems = gameData.store.foods.filter((food) => {
      return food.unlocked;
    });

    const existingOrderNames = orders.map((o) => o.name);
    const existingOrderImages = orders.map((o) => o.image);

    // Generate random order
    const newOrder = this.generateRandomOrder(
      unlockedItems,
      existingOrderNames,
      existingOrderImages,
      difficulty
    );

    return newOrder;
  };

  public generateNewOrders = (
    gameData: IGitCooking,
    difficulty: Difficulty
  ): IOrder[] => {
    let orders: IOrder[] = [];
    const nrOrders = this.getNumberOfOrders(difficulty);
    for (let i = 0; i < nrOrders; i++) {
      // Choose a random item
      const newOrder = this.generateNewOrder(
        copyObjectWithoutRef(gameData),
        orders,
        difficulty
      );
      orders.push(newOrder);
    }
    return orders;
  };

  public generateSetOfNewOrders = (
    gameData: IGitCooking,
    nrSets: number
  ): IOrder[][] => {
    let orderSets = [];

    for (let i = 0; i < nrSets; i++) {
      const difficulty =
        i === 0
          ? Difficulty.EASY
          : i === nrSets - 1
          ? Difficulty.HARD
          : Difficulty.NORMAL;

      const newSet = this.generateNewOrders(
        copyObjectWithoutRef(gameData),
        difficulty
      );
      orderSets.push(newSet);
    }
    return orderSets;
  };

  public generateSetOfBranches = (
    gameData: IGitCooking,
    nrSets: number,
    p: IProject
  ): IRemoteBranch[] => {
    const orderSet = this.generateSetOfNewOrders(gameData, nrSets);
    const defaultProps = {
      isFetched: false,
      stats: {
        missingIngredients: [],
        maxProfit: 0,
        orders: [],
        itemCount: 0,
        difficulty: Difficulty.NORMAL,
      },
    };

    let branches: IRemoteBranch[] = orderSet.map((orders, i) => {
      const branch: IRemoteBranch = {
        orders: orders,
        targetCommitId: p.remote.commits[0].id || defaultCommit.id,
        name: i === 0 ? "GitWay" : i === 1 ? "GitBite" : "GitDonald",
        ...defaultProps,
        stats: {
          ...defaultProps.stats,
          difficulty:
            i === 0 
              ? Difficulty.EASY
              : i === nrSets - 1
              ? Difficulty.HARD
              : Difficulty.NORMAL,
        },
      };
      return branch;
    });

    return branches;
  };

  private spaceOrdersEvenly = (endTime: number, orders: IOrder[]): IOrder[] => {
    const numberOfOrders = orders.length;
    const size = Math.floor(endTime / numberOfOrders);

    // create evenly spaced timestamps
    let timeStamps: number[] = [];
    for (let i = 0; i <= endTime; i += size) {
      const a = i;
      if (a < endTime) {
        timeStamps.push(a);
      }
    }

    // assign time stamps to orders
    let copyOrders: IOrder[] = copyObjectWithoutRef(orders);
    copyOrders = copyOrders.map((o, i) => {
      o.startTime = timeStamps[i];
      return o;
    });

    return copyOrders;
  };

  public simulateOrders = (
    gameTime: number,
    gameData: IGitCooking
  ): IOrder[] => {
    const dayLength = gameData.stats.dayLength.value;
    const spawnTime = gameData.stats.spawnTime.value;
    let orders: IOrder[] = copyObjectWithoutRef(
      gameData.orderService.getAllOrders()
    );

    // space orders evenly cross day length
    if (orders.some((o) => o.startTime === undefined))
      orders = this.spaceOrdersEvenly(dayLength, orders);

    // make orders available given time stamp
    orders = orders.map((o, index) => {
      // do nothing if already available
      if (o.isAvailable || o.startTime === undefined) return o;

      // set spawning
      if (gameTime + spawnTime >= o.startTime) o.spawning = true;

      // spawn the order if prev is completed
      const prevIndex = index - 1;
      const prevOrder = orders.at(prevIndex);
      if (!o.spawning && prevOrder && prevOrder.percentageCompleted > 90) {
        o.spawning = true;
        o.startTime = gameTime + gameData.stats.spawnTime.value;
      }

      o.isAvailable = gameTime >= o.startTime || gameData.states.isDayComplete;
      return o;
    });

    return orders;
  };
}

export const orderGenerator = new OrderGenerator();

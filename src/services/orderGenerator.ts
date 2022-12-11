import { v4 } from "uuid";

import { IFood } from "types/foodInterfaces";
import { femaleNames, maleNames } from "data/names";
import { femaleImages, maleImages } from "assets/avatars";
import { IGitCooking, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef, randomIntFromInterval } from "./helpers";

class OrderGenerator {
  private maxItems = 4;
  private maxOrders = 4;

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

  private chooseItems = (items: IFood[]): IFood[] => {
    const nrItems = randomIntFromInterval(1, this.maxItems);

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
    existingImages: string[]
  ): IOrder => {
    const orderId = v4();
    const { orderName, orderImage } = this.getOrderNameAndImage(
      existingOrderNames,
      existingImages
    );
    const pathPrefx = `orders/${orderName}`;

    // Choose which and how many items
    const choosenItems = this.chooseItems(items);

    // Generate the orderItems
    const orderItems: IOrderItem[] = choosenItems.map((item) => {
      return {
        name: item.name,
        orderId: orderId,
        path: `${pathPrefx}/${item.name}`,
        type: item.type,
        ingredients: item.builder(),
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
    orders: IOrder[]
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
      existingOrderImages
    );

    return newOrder;
  };

  public generateNewOrders = (gameData: IGitCooking): IOrder[] => {
    let orders: IOrder[] = [];
    const nrOrders = randomIntFromInterval(1, this.maxOrders);
    for (let i = 0; i < nrOrders; i++) {
      // Choose a random item
      const newOrder = this.generateNewOrder(
        copyObjectWithoutRef(gameData),
        orders
      );
      orders.push(newOrder);
    }
    return orders;
  };

  public generateSetOfNewORders = (
    gameData: IGitCooking,
    nrSets: number
  ): IOrder[][] => {
    let orderSets = [];
    for (let i = 0; i < nrSets; i++) {
      const newSet = this.generateNewOrders(copyObjectWithoutRef(gameData));
      orderSets.push(newSet);
    }
    return orderSets;
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

      o.isAvailable = gameTime >= o.startTime;
      return o;
    });

    return orders;
  };
}

export const orderGenerator = new OrderGenerator();

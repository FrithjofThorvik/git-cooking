import { v4 } from "uuid";

import { names } from "data/names";
import { IFood } from "types/foodInterfaces";
import { imgChef } from "assets";
import { IGitCooking, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef, randomIntFromInterval } from "./helpers";

class OrderGenerator {
  private maxItems = 4;
  private maxOrders = 4;
  private orderDuration = 10000; //in ms

  private getOrderName = (existingOrderNames: string[]) => {
    const unusedNames = names.filter((n) => !existingOrderNames.includes(n));
    let newName = unusedNames[randomIntFromInterval(0, unusedNames.length - 1)];

    return newName;
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
    existingOrderNames: string[]
  ): IOrder => {
    const orderId = v4();
    const orderName = this.getOrderName(existingOrderNames);
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
      image: imgChef,
      isAvailable: false,
      timeStart: 0,
      timeEnd: this.orderDuration,
      isCreated: false,
      orderItems: orderItems,
      percentageCompleted: 0,
    };
  };

  public generateNewOrder = (gameData: IGitCooking): IOrder => {
    // Filter out locked items
    const unlockedItems = gameData.store.foods.filter((food) => {
      return food.unlocked;
    });

    // Generate random order
    const newOrder = this.generateRandomOrder(
      unlockedItems,
      gameData.orderService.orders.map((o) => o.name)
    );

    return newOrder;
  };

  public generateNewOrders = (gameData: IGitCooking): IOrder[] => {
    let orders = [];
    const nrOrders = randomIntFromInterval(1, this.maxOrders);
    for (let i = 0; i < nrOrders; i++) {
      // Choose a random item
      const newOrder = this.generateNewOrder(copyObjectWithoutRef(gameData));
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

  public simulateOrders = (gameTime: number, gameData: IGitCooking): void => {
    gameData.orderService.orders.forEach((o) => {
      if (gameTime >= o.timeStart) o.isAvailable = true;
    });
  };
}

export const orderGenerator = new OrderGenerator();

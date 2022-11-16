import { v4 } from "uuid";
import {
  IFood,
  IGitCooking,
  IOrder,
  IOrderItem,
} from "types/gameDataInterfaces";
import { randomIntFromInterval } from "./helpers";
import { names } from "data/names";

class OrderGenerator {
  private maxItems = 3;
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
    gameTime: number,
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
        ...item,
        id: v4(),
        name: item.name,
        orderId: orderId,
        path: `${pathPrefx}/${item.name}`,
        type: item.type,
        ingredients: item.builder(item.ingredients),
      };
    });

    // Return new order
    return {
      id: orderId,
      name: orderName,
      timeStart: gameTime,
      timeEnd: gameTime + this.orderDuration,
      isCreated: false,
      orderItems: orderItems,
      items: [],
    };
  };

  private generateNewOrder = (
    gameTime: number,
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void
  ): void => {
    // Filter out locked items
    const unlockedItems = gameData.git.workingDirectory.foods.filter((food) => {
      return food.unlocked;
    });

    // Generate random order
    const newOrder = this.generateRandomOrder(
      unlockedItems,
      gameTime,
      gameData.git.workingDirectory.orders.map((o) => o.name)
    );

    // add new order to gamedata
    setGameData({
      ...gameData,
      git: {
        ...gameData.git,
        workingDirectory: {
          ...gameData.git.workingDirectory,
          orders: [...gameData.git.workingDirectory.orders, newOrder],
        },
      },
    });
  };

  public simulateOrders = (
    gameTime: number,
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void
  ): void => {
    if (gameData.git.workingDirectory.orders.length === 0) {
      this.generateNewOrder(gameTime, gameData, setGameData);
    }
    if (
      gameTime > gameData.baseDayLength / 3 &&
      gameData.git.workingDirectory.orders.length === 1
    ) {
      this.generateNewOrder(gameTime, gameData, setGameData);
    }
    if (
      gameTime > gameData.baseDayLength / 2 &&
      gameData.git.workingDirectory.orders.length === 2
    ) {
      this.generateNewOrder(gameTime, gameData, setGameData);
    }
  };
}

export const orderGenerator = new OrderGenerator();

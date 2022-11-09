import { v4 } from "uuid";
import { IngredientType } from "types/enums";
import { IFood, IGitCooking, IIngredient, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { randomIntFromInterval } from "./helpers";
import { names } from "data/names";

class OrderGenerator {
  private getOrderName = () => names[randomIntFromInterval(0, names.length - 1)];

  private chooseItems = (itemsAndIngredients: IFood[]): IFood[] => {
    const nrItems = randomIntFromInterval(1, 3);

    let items = [];
    for (let i = 0; i < nrItems; i++) {
      // Choose a random item 
      const newItemIndex = randomIntFromInterval(0, itemsAndIngredients.length - 1);
      const newItem = itemsAndIngredients.at(newItemIndex)
      newItem && items.push(newItem);
    }

    return items;
  };

  private chooseIngredients = (choosenItems: IFood): IIngredient[] => {
    const nrItems = randomIntFromInterval(1, 4);

    let ingredients = [];
    for (let i = 0; i < nrItems; i++) {
      // Choose a random ingredient 
      const newItemIndex = randomIntFromInterval(0, choosenItems.items.length - 1);
      const newIngredient = choosenItems.items.at(newItemIndex);
      newIngredient && ingredients.push(newIngredient);
    }

    return ingredients;
  };

  private generateRandomOrder = (itemsAndIngredients: IFood[], gameTime: number): IOrder => {
    const orderId = v4();
    const orderName = this.getOrderName();
    const pathPrefx = `orders/${orderName}`

    // Choose which and how many items
    const choosenItems = this.chooseItems(itemsAndIngredients);

    // Map choosen items to IOrderItem
    const orderItems: IOrderItem[] = choosenItems.map((item) => {
      return {
        ...item,
        id: v4(),
        name: item.name,
        orderId: orderId,
        path: `${pathPrefx}/${item.name}`,
        type: IngredientType.BURGER,
        ingredients: this.chooseIngredients(item),
      };
    });

    // Return new order
    return {
      id: orderId,
      name: orderName,
      timeEnd: gameTime + 10000,
      isCreated: false,
      orderItems: orderItems,
      items: [],
    };
  };

  public buildNewOrder = (
    gameTime: number,
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void
  ): void => {

    // Filter out locked items
    const unlockedItems = gameData.directory.foods.filter((food) => {
      return food.unlocked;
    });

    // Filter out locked ingredients
    const unlockedItemsAndIngredients = unlockedItems.map((item) => {
      return {
        id: item.id,
        name: item.name,
        unlocked: item.unlocked,
        items: item.items.filter((i) => i.purchased),
      };
    });

    // Generate random order
    const newOrder = this.generateRandomOrder(unlockedItemsAndIngredients, gameTime);
    setGameData({ ...gameData, directory: { ...gameData.directory, orders: [...gameData.directory.orders, newOrder] } })
  };
}

export const orderGenerator = new OrderGenerator();

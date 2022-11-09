import React from "react";

import Orders from "components/work/Orders";
import { setGameData, useGameData } from "hooks/useGameData";
import { orderGenerator } from "services/orderGenerator";
import { useGameTime } from "hooks/useGameTime";

interface IOrdersControllerProps { }

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const gameTime = useGameTime();

  const generateOrder = () => {
    orderGenerator.buildNewOrder(gameTime, gameData, setGameData);
  }

  return <Orders
    orders={gameData.directory.orders.map((order) => {
      return {
        percent: (gameTime / order.timeEnd) * 100,
        items: order.orderItems.map((item) => {
          return { ingredients: item.ingredients.map((i) => i.image) };
        }),
        name: order.name,
      };
    })
    }
    generateOrder={generateOrder} />;
};

export default OrdersController;

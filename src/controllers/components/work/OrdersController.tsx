import React, { useEffect } from "react";

import Orders from "components/work/Orders";
import { setGameData, useGameData } from "hooks/useGameData";
import { orderGenerator } from "services/orderGenerator";
import { useGameTime } from "hooks/useGameTime";

interface IOrdersControllerProps {}

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const gameTime = useGameTime();

  useEffect(() => {
    orderGenerator.simulateOrders(gameTime, gameData, setGameData);
  }, [gameTime, gameData]);

  const formattedOrders = gameData.directory.orders.map((order) => {
    return {
      percent:
        ((gameTime - order.timeStart) / (order.timeEnd - order.timeStart)) *
        100,
      items: order.orderItems.map((item) => {
        return { ingredients: item.ingredients.map((i) => i.image) };
      }),
      name: order.name,
    };
  });

  return <Orders orders={formattedOrders} />;
};

export default OrdersController;

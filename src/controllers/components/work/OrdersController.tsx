import React, { useEffect, useState } from "react";

import { useGameTime } from "hooks/useGameTime";
import { compareOrders } from "services/gameDataHelper";
import { orderGenerator } from "services/orderGenerator";
import { setGameData, useGameData } from "hooks/useGameData";
import Orders, { IOrdersProps } from "components/work/Orders";

interface IOrdersControllerProps {}

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const gameTime = useGameTime();
  const [formattedOrders, setFormattedOrders] = useState<
    IOrdersProps["orders"]
  >([]);

  useEffect(() => {
    orderGenerator.simulateOrders(gameTime, gameData, setGameData);
  }, [gameTime, gameData]);

  useEffect(() => {
    const parentCommit = gameData.git.getHeadCommit();
    const prevDirectory = parentCommit?.directory;

    setFormattedOrders(
      gameData.git.workingDirectory.orders.map((order) => {
        let percentageCompleted = 0;
        const committedOrder = prevDirectory?.orders.find(
          (o) => o.id == order.id
        );

        if (committedOrder)
          percentageCompleted = Math.round(
            compareOrders(committedOrder.items, order.orderItems) * 100
          );

        return {
          percent:
            ((gameTime - order.timeStart) / (order.timeEnd - order.timeStart)) *
            100,
          items: order.orderItems.map((item) => {
            return { ingredients: item.ingredients.map((i) => i.image) };
          }),
          name: order.name,
          percentageCompleted: percentageCompleted,
        };
      })
    );
  }, [gameData.git.workingDirectory.orders, gameData.git.commits]);

  return <Orders orders={formattedOrders} />;
};

export default OrdersController;

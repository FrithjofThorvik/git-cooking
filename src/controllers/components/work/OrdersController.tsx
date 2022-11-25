import React, { useEffect, useState } from "react";

import { IDirectory } from "types/gameDataInterfaces";
import { useGameTime } from "hooks/useGameTime";
import { orderGenerator } from "services/orderGenerator";
import { copyObjectWithoutRef } from "services/helpers";
import { setGameData, useGameData } from "hooks/useGameData";
import Orders, { IOrdersProps } from "components/work/Orders";
import { calculateOrderTimerPercentage } from "services/gameDataHelper";

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
    const headCommit = gameData.git.getHeadCommit();
    const prevDirectory: IDirectory = copyObjectWithoutRef(
      headCommit?.directory
    );
    setFormattedOrders(
      gameData.git.workingDirectory.orders.map((order) => {
        const relatedCommitedOrder = prevDirectory.orders.find(
          (prevOrder) => prevOrder.id === order.id
        );
        return {
          percent: calculateOrderTimerPercentage(
            gameTime,
            order.timeStart,
            order.timeEnd
          ),
          items: order.orderItems,
          order: order,
          percentageCompleted: relatedCommitedOrder
            ? relatedCommitedOrder.percentageCompleted
            : 0,
        };
      })
    );
  }, [gameData.git.workingDirectory.orders, gameData.git.commits]);

  useEffect(() => {
    setFormattedOrders(
      formattedOrders.map((formattedOrder) => {
        return {
          ...formattedOrder,
          percent: calculateOrderTimerPercentage(
            gameTime,
            formattedOrder.order.timeStart,
            formattedOrder.order.timeEnd
          ),
        };
      })
    );
  }, [gameTime]);

  return <Orders orders={formattedOrders} />;
};

export default OrdersController;

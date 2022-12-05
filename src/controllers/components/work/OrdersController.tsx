import React, { useEffect, useState } from "react";

import { IDirectory } from "types/gameDataInterfaces";
import { useGameTime } from "hooks/useGameTime";
import { orderGenerator } from "services/orderGenerator";
import { copyObjectWithoutRef } from "services/helpers";
import { setGameData, useGameData } from "hooks/useGameData";
import { calculateOrderTimerPercentage } from "services/gameDataHelper";
import Orders, { IOrdersProps } from "components/work/Orders";

interface IOrdersControllerProps {}

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();
  const [formattedOrders, setFormattedOrders] = useState<
    IOrdersProps["orders"]
  >([]);

  useEffect(() => {
    orderGenerator.simulateOrders(timeLapsed, gameData, setGameData);
  }, [timeLapsed, gameData]);

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
          timerPercent: calculateOrderTimerPercentage(
            timeLapsed,
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
    formattedOrders.length !== 0 &&
      setFormattedOrders(
        formattedOrders.map((formattedOrder) => {
          return {
            ...formattedOrder,
            percent: calculateOrderTimerPercentage(
              timeLapsed,
              formattedOrder.order.timeStart,
              formattedOrder.order.timeEnd
            ),
          };
        })
      );
  }, [timeLapsed]);

  return <Orders orders={formattedOrders} />;
};

export default OrdersController;

import React, { useEffect, useState } from "react";

import { useGameTime } from "hooks/useGameTime";
import { useGameData } from "hooks/useGameData";
import { orderGenerator } from "services/orderGenerator";
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
    orderGenerator.simulateOrders(timeLapsed, gameData);
  }, [timeLapsed, gameData]);

  useEffect(() => {
    setFormattedOrders(
      gameData.orderService.orders.map((order) => {
        return {
          timerPercent: calculateOrderTimerPercentage(
            timeLapsed,
            order.timeStart,
            order.timeEnd
          ),
          items: order.orderItems,
          order: order,
          percentageCompleted: order.percentageCompleted,
        };
      })
    );
  }, [gameData.orderService.orders, gameData.git.commits]);

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

import React, { useEffect } from "react";

import { useGameTime } from "hooks/useGameTime";
import { setGameData, useGameData } from "hooks/useGameData";
import { orderGenerator } from "services/orderGenerator";
import Orders from "components/work/Orders";

interface IOrdersControllerProps {}

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const { timeLapsed } = useGameTime();

  useEffect(() => {
    const updatedOrders = orderGenerator.simulateOrders(timeLapsed, gameData);
    const updatedOrderService =
      gameData.orderService.setNewOrders(updatedOrders);
    setGameData({
      ...gameData,
      orderService: updatedOrderService,
    });
  }, [timeLapsed, gameData]);

  return (
    <Orders
      orders={gameData.orderService.getAvailableOrders()}
      spawning={gameData.orderService
        .getAllOrders()
        .some((o) => o.spawning && !o.isAvailable)}
      totalOrders={gameData.orderService.getAllOrders().length}
    />
  );
};

export default OrdersController;

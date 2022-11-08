import React from "react";

import Orders from "components/work/Orders";
import { useGameData } from "hooks/useGameData";

interface IOrdersControllerProps { }

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  const gameData = useGameData();

  const formattedOrders = gameData.directory.orders.map(order => {
    const formattedOrder = {
      percent: 45,
      items: order.orderItems.map(item => {
        return { ingredients: item.ingredients.map(i => i.image) }
      }),
      name: order.name
    }

    return formattedOrder;
  })

  return <Orders orders={formattedOrders} />;
};

export default OrdersController;

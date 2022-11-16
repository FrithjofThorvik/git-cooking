import React, { useEffect, useState } from "react";

import Stage, { IStageProps } from "components/work/Stage";
import { useGameData } from "hooks/useGameData";
import { compareOrders, isOrderItem } from "services/helpers";
import { IOrder, Item, IOrderItem } from "types/gameDataInterfaces";

interface IStageControllerProps {}

const StageController: React.FC<IStageControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const [orders, setOrders] = useState<IStageProps["orders"]>([]);

  useEffect(() => {
    let stagedItemsWithOrder: { items: IOrderItem[]; order: IOrder }[] = [];
    gameData.git.stagedItems.forEach((item: Item) => {
      if (isOrderItem(item)) {
        const relatedOrder = gameData.git.workingDirectory.orders
          .filter((o: IOrder) => o.id === item.orderId)
          .at(0);

        const elementIndex = stagedItemsWithOrder.findIndex(
          (element) => element.order.name === relatedOrder?.name
        );

        if (relatedOrder && elementIndex === -1) {
          stagedItemsWithOrder.push({
            items: [item],
            order: relatedOrder,
          });
        } else {
          stagedItemsWithOrder[elementIndex].items.push(item);
        }
      }
    });

    // update percent
    setOrders(
      stagedItemsWithOrder.map((o) => {
        return {
          name: o.order.name,
          percent: Math.round(compareOrders(o.items, o.order.orderItems) * 100),
          files: o.items.map((i) => i.name),
        };
      })
    );
  }, [gameData.git.stagedItems]);

  return <Stage orders={orders} />;
};

export default StageController;

import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import { isOrderItem } from "services/helpers";
import { compareOrders } from "services/gameDataHelper";
import { IOrder, Item, IOrderItem } from "types/gameDataInterfaces";
import { IModifiedItem } from "types/gitInterfaces";
import Stage, { IStageProps } from "components/work/Stage";

interface IStageControllerProps {}

const StageController: React.FC<IStageControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const [orders, setOrders] = useState<IStageProps["orders"]>([]);

  useEffect(() => {
    let stagedItemsWithOrder: { items: IOrderItem[]; order: IOrder }[] = [];
    gameData.git.stagedItems.forEach((stagedItem: IModifiedItem) => {
      const item = stagedItem.item;
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

import React, { useEffect, useState } from "react";

import { useGameData } from "hooks/useGameData";
import { IModifiedItem } from "types/gitInterfaces";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef } from "services/helpers";
import Stage, { IStageProps } from "components/work/Stage";

interface IStageControllerProps {}

const StageController: React.FC<IStageControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  const [orders, setOrders] = useState<IStageProps["stagedOrders"]>([]);

  useEffect(() => {
    let stagedItemsWithOrder: { items: IOrderItem[]; order: IOrder }[] = [];
    gameData.git.stagedItems.forEach((stagedItem: IModifiedItem) => {
      const item = stagedItem.item;
      let relatedOrder = gameData.orderService.orders.find(
        (o: IOrder) => o.id === item.orderId
      );

      const headCommit = gameData.git.getHeadCommit();
      if (headCommit) {
        const prevDirectory = copyObjectWithoutRef(headCommit.directory);
        const stagedOnPrevDirectory =
          gameData.git.addStagedOnPrevDirectory(prevDirectory);

        relatedOrder = gameData.orderService
          .updatePercentageCompleted(stagedOnPrevDirectory.createdItems)
          .orders.find((o: IOrder) => o.id === item.orderId);
      }

      const elementIndex = stagedItemsWithOrder.findIndex(
        (element) => element.order.id === relatedOrder?.id
      );

      if (relatedOrder && elementIndex === -1) {
        stagedItemsWithOrder.push({
          items: [item],
          order: relatedOrder,
        });
      } else {
        stagedItemsWithOrder[elementIndex].items.push(item);
      }
    });

    // update percent
    setOrders(stagedItemsWithOrder);
  }, [JSON.stringify(gameData.git.stagedItems)]);

  return <Stage stagedOrders={orders} />;
};

export default StageController;

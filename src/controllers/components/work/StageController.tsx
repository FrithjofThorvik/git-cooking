import React from "react";

import Stage, { IStageProps } from "components/work/Stage";
import { useGameData } from "hooks/useGameData";
import { isOrderItem } from "services/helpers";

interface IStageControllerProps { }

const StageController: React.FC<IStageControllerProps> = (): JSX.Element => {
  const gameData = useGameData();
  let orders: IStageProps["orders"] = [];

  gameData.gitStagedItems.forEach((item) => {
    if (isOrderItem(item)) {
      const relatedOrder = gameData.directory.orders
        .filter((o) => o.id === item.orderId)
        .at(0);

      const elementIndex = orders.findIndex(
        (element) => element.name === relatedOrder?.name
      );

      if (elementIndex === -1) {
        orders.push({
          name: relatedOrder?.name ? relatedOrder.name : "Order",
          percent: 45,
          files: [item.name],
        });
      } else {
        orders[elementIndex].files.push(item.name);
      }
    }
  });

  return <Stage orders={orders} />;
};

export default StageController;

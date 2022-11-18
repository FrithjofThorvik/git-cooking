import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { getOrderNameFromId } from "services/gameDataHelper";
import { IOrder, IOrderItem } from "types/gameDataInterfaces";

import "./ItemSelector.scss";

interface IItemSelectorProps {
  orders: IOrder[];
  items: IOrderItem[];
  activeItem: IOrderItem | null;
  setActiveItem: React.Dispatch<React.SetStateAction<IOrderItem | null>>;
  closeOrderItem: (item: IOrderItem) => void;
}

interface IOrderGroup {
  name: string;
  orderGroupId: string;
  items: IOrderItem[];
  isOpen: boolean;
}

const ItemSelector: React.FC<IItemSelectorProps> = ({
  items,
  orders,
  activeItem,
  setActiveItem,
  closeOrderItem,
}): JSX.Element => {
  const [orderGroups, setOrderGroups] = useState<IOrderGroup[]>([]);

  const toggleOrderGroup = (orderGroup: IOrderGroup) => {
    const updatedOrderGroups = orderGroups.map((og) => {
      if (og.orderGroupId === orderGroup.orderGroupId) {
        return { ...og, isOpen: !og.isOpen };
      }
      return og;
    });

    setOrderGroups(updatedOrderGroups);
  };

  useEffect(() => {
    let tempOrderGroups: IOrderGroup[] = [];
    items.forEach((i) => {
      let orderGroupIds = tempOrderGroups.map((g) => g.orderGroupId);
      if (orderGroupIds.includes(i.orderId)) {
        tempOrderGroups.forEach((g) => {
          if (g.orderGroupId === i.orderId) {
            g.items.push(i);
          }
        });
      } else {
        tempOrderGroups.push({
          name: getOrderNameFromId(orders, i.orderId),
          orderGroupId: i.orderId,
          items: [i],
          isOpen: true,
        });
      }
    });
    setOrderGroups(tempOrderGroups);
  }, [items]);

  return (
    <div className="item-selector">
      {orderGroups.map((og) => (
        <div className="item-selector-group" key={og.orderGroupId}>
          <div
            className="item-selector-group-label"
            onClick={() => toggleOrderGroup(og)}
          >
            {og.name}
          </div>
          <div className="item-selector-group-items">
            {og.isOpen &&
              og.items.map((i) => (
                <div
                  key={i.path}
                  className={`item-selector-group-items-item ${
                    activeItem?.path === i.path &&
                    "item-selector-group-items-item-selected"
                  }`}
                  onClick={() => setActiveItem(i)}
                >
                  {i.name}
                  <CloseIcon
                    className="item-selector-group-items-item-icon"
                    onClick={() => closeOrderItem(i)}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemSelector;

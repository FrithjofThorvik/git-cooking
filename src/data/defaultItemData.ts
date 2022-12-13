import { copyObjectWithoutRef } from "services/helpers";
import { IItemInterface, IOrderItem } from "types/gameDataInterfaces";

export const defaultItemData: IItemInterface = {
  selectedItemIds: [],
  activeItemId: "",
  openItem: function (orderItem: IOrderItem) {
    let copy: IItemInterface = copyObjectWithoutRef(this);
    if (!copy.selectedItemIds.includes(orderItem.path))
      copy.selectedItemIds.push(orderItem.path);
    copy.activeItemId = orderItem.path;
    return copy;
  },
  closeItem: function (orderItem: IOrderItem) {
    let copy: IItemInterface = copyObjectWithoutRef(this);
    if (copy.selectedItemIds.includes(orderItem.path)) {
      copy.selectedItemIds = copy.selectedItemIds.filter(
        (id) => id !== orderItem.path
      );
      if (copy.activeItemId === orderItem.path) {
        copy.activeItemId = copy.selectedItemIds[0];
      }
    }
    return copy;
  },
};

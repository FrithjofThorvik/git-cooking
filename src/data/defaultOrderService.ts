import { compareOrders } from "services/gameDataHelper";
import { copyObjectWithoutRef } from "services/helpers";
import { IOrder, IOrderItem, IOrderService } from "types/gameDataInterfaces";

export const defaultOrderService = {
  orders: [],
  updatePercentageCompleted: function (createdItems: IOrderItem[]) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy.orders.forEach((o) => {
      o.percentageCompleted = compareOrders(createdItems, o);
    });
    return copy;
  },
  createOrderFolder: function (order: IOrder) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy.orders.forEach((o) => {
      if (o.id === order.id) {
        o.isCreated = true;
      }
    });
    return copy;
  },
  setNewOrders: function (orders: IOrder[]) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy.orders = orders;
    return copy;
  },
};

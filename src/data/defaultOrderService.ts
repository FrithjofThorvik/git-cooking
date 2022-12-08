import { compareOrders } from "services/gameDataHelper";
import { copyObjectWithoutRef } from "services/helpers";
import { IOrder, IOrderItem, IOrderService } from "types/gameDataInterfaces";

export const defaultOrderService: IOrderService = {
  _orders: [],
  updatePercentageCompleted: function (createdItems: IOrderItem[]) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy.getAvailableOrders().forEach((o) => {
      o.percentageCompleted = compareOrders(createdItems, o);
    });
    return copy;
  },
  createOrderFolder: function (order: IOrder) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy.getAvailableOrders().forEach((o) => {
      if (o.id === order.id) {
        o.isCreated = true;
      }
    });
    return copy;
  },
  setNewOrders: function (orders: IOrder[]) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy._orders = orders;
    return copy;
  },
  getAvailableOrders: function () {
    return this._orders.filter((o) => o.isAvailable);
  },
  getAllOrders: function () {
    return this._orders;
  },
};

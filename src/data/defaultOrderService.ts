import { compareOrders } from "services/gameDataHelper";
import { copyObjectWithoutRef } from "services/helpers";
import { IOrder, IOrderItem, IOrderService } from "types/gameDataInterfaces";

export const defaultOrderService: IOrderService = {
  _orders: [],
  branches: [],
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
  setNewOrders: function (orders: IOrder[], branchName?: string) {
    let copy: IOrderService = copyObjectWithoutRef(this);
    copy._orders = copyObjectWithoutRef(orders);

    if (!branchName) return copy;
    const branchIndex = copy.branches.findIndex((b) => b.name === branchName);
    if (branchIndex === -1) {
      //add branch
      copy.branches.push({
        name: branchName,
        orders: copyObjectWithoutRef(orders),
      });
    } else {
      // update orders of branch
      copy.branches[branchIndex].orders === orders;
    }
    return copy;
  },
  getAvailableOrders: function () {
    return this._orders.filter((o) => o.isAvailable);
  },
  getAllOrders: function () {
    return this._orders;
  },
  switchBranch: function (fromBranchName: string, toBranchName: string) {
    let copy: IOrderService = copyObjectWithoutRef(this);

    const fromBranchIndex = copy.branches.findIndex(
      (b) => b.name === fromBranchName
    );
    const toBranchIndex = copy.branches.findIndex(
      (b) => b.name === toBranchName
    );
    if (fromBranchIndex !== -1) {
      const currentOrders = copyObjectWithoutRef(copy._orders);
      if (toBranchIndex !== -1)
        copy = copy.setNewOrders(copy.branches[toBranchIndex].orders);
      copy.branches[fromBranchIndex].orders = currentOrders;
    }

    return copy;
  },
};

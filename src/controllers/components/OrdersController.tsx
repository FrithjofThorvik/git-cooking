import React from "react";
import Orders from "../../components/orders/Orders";

interface IOrdersControllerProps {}

const OrdersController: React.FC<IOrdersControllerProps> = (): JSX.Element => {
  return <Orders />;
};

export default OrdersController;

import React, { useEffect, useRef } from "react";

import OrderCard from "./orders/OrderCard";

import "./Orders.scss";
import { IOrder } from "types/gameDataInterfaces";
import { useHover } from "hooks/useHover";

export interface IOrdersProps {
  orders: IOrder[];
  totalOrders: number;
  spawning: boolean;
}

const Orders: React.FC<IOrdersProps> = ({
  orders,
  spawning,
  totalOrders,
}): JSX.Element => {
  const ordersRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isHovered = useHover(ordersRef);

  useEffect(() => {
    if (!spawning && ordersRef.current) {
      ordersRef.current.scrollTo({
        top: ordersRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    if (spawning && textRef.current) {
      textRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [spawning]);

  return (
    <div className="content">
      <p className="content-info">
        {orders.length}/{totalOrders} Orders
      </p>
      <div className={`orders ${isHovered ? "hovered" : ""}`} ref={ordersRef}>
        {orders &&
          orders.map((order, index) => <OrderCard order={order} key={index} />)}
        {spawning && (
          <p className="orders-new" ref={textRef}>
            New order arriving...
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;

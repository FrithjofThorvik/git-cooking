import React from "react";
import GlassContainer from "../GlassContainer";

import "./OrderCard.scss";

interface IOrderCardProps {}

const OrderCard: React.FC<IOrderCardProps> = (): JSX.Element => {
  return (
    <div className="orderCard">
      <GlassContainer>
        <div className="content">
          <h1>Hello</h1>
          <p>asd</p>
        </div>
      </GlassContainer>
    </div>
  );
};

export default OrderCard;

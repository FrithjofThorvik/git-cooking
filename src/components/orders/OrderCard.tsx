import React from "react";
import AddIcon from "@mui/icons-material/Add";

import chefImg from "../../assets/chef.png";
import GlassContainer from "../GlassContainer";

import "./OrderCard.scss";

interface IOrderCardProps {
  percent: number;
}

const OrderCard: React.FC<IOrderCardProps> = ({ percent }): JSX.Element => {
  return (
    <div className="orderCard">
      <GlassContainer border shadow>
        <div className="content">
          <div className="person">
            <img src={chefImg} alt="chef" />
            <div className="progressBar">
              <div className="progress" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
          <div className="coworker">
            <AddIcon />
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default OrderCard;

import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./Button.scss";

interface IButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<IButtonProps> = ({ text, onClick }): JSX.Element => {
  return (
    <div className="order-generator" onClick={onClick}>
      <AddCircleOutlineIcon className="order-generator-icon" />
      <div>{text}</div>
    </div>
  );
};

export default Button;

import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import "./Button.scss";

interface IButtonProps {
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<IButtonProps> = ({
  text,
  disabled,
  onClick,
}): JSX.Element => {
  return (
    <div
      className="order-generator"
      onClick={onClick}
      style={{
        opacity: `${disabled ? "0.5" : "1"}`,
        pointerEvents: `${disabled ? "none" : "auto"}`,
      }}
    >
      <AddCircleOutlineIcon className="order-generator-icon" />
      <p>{text}</p>
    </div>
  );
};

export default Button;

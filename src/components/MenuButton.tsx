import React from "react";

import "./MenuButton.scss";

export interface IMenuButtonProps {
  text: string;
  onClick: () => void;
  type: "default" | "green";
}

const MenuButton: React.FC<IMenuButtonProps> = ({
  text,
  onClick,
  type = "default",
}): JSX.Element => {
  return (
    <button className={`menu-button ${type}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default MenuButton;

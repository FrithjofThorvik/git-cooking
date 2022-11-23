import React from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

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
      {type === "default" && (
        <ChevronRightOutlinedIcon style={{ transform: "rotate(180deg)" }} />
      )}
      <div>{text}</div>
      {type === "green" && <ChevronRightOutlinedIcon />}
    </button>
  );
};

export default MenuButton;
